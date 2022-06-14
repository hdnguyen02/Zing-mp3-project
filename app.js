
const app = (function(){
    const api = 'https://api.apify.com/v2/key-value-stores/EJ3Ppyr2t73Ifit64/records/LATEST?fbclid=IwAR39d_x0QCUHtb9AQ21dai2Qz_SOgI3KzSlkts-JDarbLey-gvet8jjbY4w'
    
    
    const detailMp3 = document.getElementById('detail-mp3')  //  thẻ ul chứa khu vực mp3 
    const collectChildMp3 = document.getElementsByClassName('child-mp3') // chứa các li (child-mp3)
    const track = document.createElement('audio')
    const volume = document.getElementById('volume') 
    const showVolumeElement = document.getElementById('show-volume')  
    const btnPrevious = document.getElementById('previous')
    const btnPlayPause = document.getElementById('play-pause')
    const btnNext = document.getElementById('next')
    const btnMute = document.getElementById('mute')
    const showTotalTime = document.getElementById('total-time')
    const showCurentTime = document.getElementById('curent-time')
    const statusMusic = document.getElementById('status-music')


    let data = {}
    let curentInterval
    let curentVolume 
    let curentTimeMusic = 0
    let curentIndexSong = 0 
    let isPlay = false 
    let isMute = false 
    
    function demDuHaiSo(number) {
        return  number.toString().padStart(2, '0');
    }

    const secondToMinuteSecond = (total) => {  
        let soPhut = Math.floor(total / 60) 
        let soGiay = Math.floor(total % 60) 
        return `${demDuHaiSo(soPhut)}:${demDuHaiSo(soGiay)}`
    } 
    

    
    const nextMusic = () => { 
        curentTimeMusic = 0
        if (curentIndexSong != data.length - 1) { 
            curentIndexSong++
            playMusic(curentIndexSong)
        }
        else { 
                curentIndexSong = 0
                playMusic(curentIndexSong)
            }
    }



    const clickNextMusic = () => {  
        btnNext.addEventListener('click',() => { 
            nextMusic()
        })
    }

    const playPauseMusic = () => { 
        btnPlayPause.addEventListener('click',() => { 
            if (isPlay) { 
                track.pause() 
                curentTimeMusic = track.currentTime
                isPlay = false
                btnPlayPause.firstElementChild.classList.remove('fa-pause')
                btnPlayPause.firstElementChild.classList.add('fa-play')
            }
            else { 
                playMusic(curentIndexSong)
                btnPlayPause.firstElementChild.classList.remove('fa-play')
                btnPlayPause.firstElementChild.classList.add('fa-pause')
            }
        })
    }

    const mute = () => { 
        btnMute.addEventListener('click',() => {  
            if(isMute) { 
                btnMute.firstElementChild.classList.add('fa-volume-high')
                btnMute.firstElementChild.classList.remove('fa-volume-xmark')
                isMute = false 
                track.volume = curentVolume
                showVolumeElement.innerHTML = curentVolume*100
            }
            else { 
                btnMute.firstElementChild.classList.remove('fa-volume-high')
                btnMute.firstElementChild.classList.add('fa-volume-xmark')
                isMute = true
                curentVolume = track.volume 
                track.volume = 0 
                showVolumeElement.innerHTML = 0
            }
        })
    }
    const previousMusic = () => { 
            curentTimeMusic = 0
            if (curentIndexSong > 0) {  
                curentIndexSong--  
                playMusic(curentIndexSong)
            } 
            else { 
                curentIndexSong = data.length - 1
                playMusic(curentIndexSong)
            }
    }


    const clickPreviousMusic = () => { 
        btnPrevious.addEventListener('click',() => { 
            previousMusic()
        })
    } 

     

    const getData = async (api) => { 
        try { 
            let dataJSON = await fetch(api) 
            data = await dataJSON.json() 
            data = data.songs.top100_VN[0].songs; 
            renderData(data)
            getEventclickMusic(collectChildMp3)  // Hàm bắt sự kiện người dùng click nhạc. 
            getChangeVolume(volume)
            clickNextMusic()
            clickPreviousMusic()
            playPauseMusic()
            mute()
            changeStatusMusic()
            checkEndMusic()
            
        }
        catch(error){
            alert(error)
        }
    }

    const checkEndMusic = () => { 
        track.addEventListener('ended',() => { 
           nextMusic()
        })
    }

    const changeStatusMusic = () => { 
        statusMusic.addEventListener('click',() => { 
            if (isPlay) { 
                track.currentTime = statusMusic.value
                showTimeAndStatusDuration()
                // clearInterval(curentInterval)
                // curentInterval = setInterval(() => {
                //     statusMusic.value = track.currentTime
                //     showCurentTime.innerHTML = secondToMinuteSecond(track.currentTime)
                // },1000)
            }
            else { 
                statusMusic.value = 0
            }
        })
    }


    function showTimeAndStatusDuration() {
        statusMusic.setAttribute('max',track.duration) // sữa đổi trạng thái ->
        clearInterval(curentInterval)
        curentInterval = setInterval(()=>{
            statusMusic.value = track.currentTime
            showCurentTime.innerHTML = secondToMinuteSecond(track.currentTime)
        },1000)
    }
    
    const playMusic = (indexSong)=>{
            track.setAttribute('src',data[indexSong].music)
            track.currentTime = curentTimeMusic
            track.play()
            .then(()=>{
                isPlay = true
                btnPlayPause.firstElementChild.classList.remove('fa-play')
                btnPlayPause.firstElementChild.classList.add('fa-pause')
                statusMusic.value = 0
                clearInterval(curentInterval) 
                showTotalTime.innerHTML = secondToMinuteSecond(track.duration)
                showTimeAndStatusDuration()
                // sữa đổi thanh trạng thái -> thay đổi trạng thái vê 0 
            })
            .catch((err)=>{
                alert(err)
                isPlay = false
            })  
    }
    const getEventclickMusic = (collectChildMp3) => { 
        Array.prototype.forEach.call(collectChildMp3,(childMp3) => { 
            childMp3.addEventListener('click',(event)=>{ 
                curentIndexSong =Number(event.target.getAttribute('index-song')) 
                playMusic(curentIndexSong)
            })
        })
    }


    const getChangeVolume = (volume) => { 
        volume.addEventListener('change',(event) => { 
            showVolumeElement.innerHTML = event.target.value
            track.volume = event.target.value/100 
        })
    }

    const renderData = (data) => { 
        let html = data.map((song,index)=>{ 
            return `
                <li index-song='${index}' class="child-mp3">
                <div>
                    <div class="img-mp3"><img src="${song.avatar}"></div>
                    <div>
                        <span>${song.title}</span>
                        <span>${song.creator}</span>
                    </div>   
                </div>
                <div>
                    <span>Thương Em (Single)</span>
                </div>
                <div>
                    <span>05:00</span>
                </div>
            </li>
            `
        })
        detailMp3.innerHTML = html.join('')
    }
    return { 
        run:function() {  
            
            getData(api)
        }
    }
})(); 


app.run()
