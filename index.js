const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playList = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnPrev = $('.btn-prev')
const btnNext = $('.btn-next')
const btnRandom = $('.btn-random')

const app = {
    currentIndex: 0,
    isPlaying:false,
    isRandom: false,
    songs: [
        {
            name:'Buồn Không Em',
            singer: 'Đạt G',
            path: './Song/Song_1.mp3',
            image: './Image/Song_1.jpg'
        },
        {
            name:'Thích hay là yêu còn chưa biết',
            singer: 'Lona, Ricky Star',
            path: './Song/Song_2.mp3',
            image: './Image/Song_2.jpg'
        },
        {
            name:'Cupid',
            singer: ' 더는 믿지 않아',
            path: './Song/Song_3.mp3',
            image: './Image/Song_3.jpg'
        },
        {
            name:'Còn Thương Thì Không Để Em Khóc',
            singer: 'Đạt G',
            path: './Song/Song_4.mp3',
            image: 'https://i.ytimg.com/vi/tZ4mLHtTku4/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAd9LaPCtVkH9-YCZOsfAzmtZ6VoQ'
        },
        {
            name:'CÔ ĐƠN TRÊN SOFA ',
            singer: 'Trung Quân Cover',
            path: './Song/Song_5.mp3',
            image: 'https://i.ytimg.com/vi/u7ScW1kCgS0/mqdefault.jpg'
        },
        {
            name:'ĐỔI HẠNH PHÚC LẤY CÔ ĐƠN',
            singer: 'Song Luân',
            path: './Song/Song_6.mp3',
            image: 'https://i.ytimg.com/vi/jtCDyvwhW40/mqdefault.jpg'
        },
        {
            name:'Westside SQUAD',
            singer: 'jombie ft Dế Choắt & Endless',
            path: './Song/Song_7.mp3',
            image: 'https://i.ytimg.com/vi/55F8bT91KG4/mqdefault.jpg'
        },
        {
            name:'Bật Tình Yêu Lên ',
            singer: 'Hòa Minzy x Tăng Duy Tân',
            path: './Song/Song_8.mp3',
            image: 'https://i.ytimg.com/vi/VHjMJeLsI0o/mqdefault.jpg'
        },
        {
            name:'Thu Cuối ',
            singer: 'Mr T x Yanbi x Hằng Bingboong',
            path: './Song/Song_9.mp3',
            image: 'https://i.ytimg.com/vi/6KH8eqKlohA/mqdefault.jpg'
        },
        {
            name:'Thủ Đô Cypher ',
            singer: 'RPT Orijinn, LOW G, RZMas, RPT MCK',
            path: './Song/Song_10.mp3',
            image: 'https://i.ytimg.com/vi/yET2SBRuNm0/mqdefault.jpg'
        },
    ],

    render: function(){
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this , 'currentSong' ,
        {
            get : function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const cdWidth = cd.offsetWidth
        const _this = this
        // Xử lí quay đĩa CD
        const cdAnimate = cd.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],
        {
            duration: 10000, // 40s
            iterations: Infinity
        }
        )
        cdAnimate.pause()

        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity =  newCdWidth / cdWidth
        }

        //Xử lí khi click Play
        btnPlay.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
        }

        //Khi Song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdAnimate.play()
        }

        //Khi song bị ngừng 
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdAnimate.pause()
        }

        //Thanh chạy khi thời gian hát thay đổi
        audio.ontimeupdate = function() {
            const progressPercent = Math.floor(audio.currentTime  * 100 / audio.duration)
            progress.value = progressPercent
        }

        //Xử Lí khi tua nhanh
        progress.onchange = function(e){
            const seektTime = e.target.value * audio.duration / 100
            audio.currentTime = seektTime
        }

        //Xử lí prev bài hát
        btnPrev.onclick =function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
        }

        //Xử lí next bài hát
        btnNext.onclick = function() {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
        }

        //Xử lí khi random bài hát
        btnRandom.onclick = function(){
            _this.isRandom =!_this.isRandom
            btnRandom.classList.toggle('active',_this.isRandom)
        }

        //Xử lí khi kết thúc bài hát
        audio.onended = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
        }
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})` 
        audio.src = this.currentSong.path
    },  

    prevSong: function(){
        app.currentIndex--
        if(app.currentIndex <=  0){
            app.currentIndex = app.songs.length -1
        }  
        app.loadCurrentSong()
    },

    nextSong: function(){
        app.currentIndex++
        if(app.currentIndex >= app.songs.length ){
            app.currentIndex = 0
        }  
        app.loadCurrentSong()
    },

    randomSong: function(){
        let tempArray = []
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(tempArray.includes(newIndex) || newIndex === app.currentIndex)
        app.currentIndex = newIndex
        tempArray.push(newIndex)
        this.loadCurrentSong()
    },

    start: function(){
        //Định nghĩa các thượco tính cho Object
        this.defineProperties()
        // Lắng nghe và xử lí các sự kiện
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()

        this.render()
    }
}

app.start()