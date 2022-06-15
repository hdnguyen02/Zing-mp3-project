
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
    const curentImage = document.getElementById('curent-image')
    const curentSongPlay = document.getElementById('curent-song-play')
    const curentCreator = document.getElementById('curent-creator')
    const search = document.getElementById('search')

    let data = {}
    let curentInterval = null
    let curentIndexSong = 0 
    let previousIndexSong = null // đánh dấu chưa phát bài nào
    let isPlay = null // đánh dấu chưa phát bài nào  
    let isMute = false 
    let curentVolume 
    
    function demDuHaiSo(number) {
        return  number.toString().padStart(2, '0');
    }

    const secondToMinuteSecond = (total) => {  
        let soPhut = Math.floor(total / 60) 
        let soGiay = Math.floor(total % 60) 
        return `${demDuHaiSo(soPhut)}:${demDuHaiSo(soGiay)}`
    } 
    

    
    const nextMusic = () => { 
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

    const removeAndAddClassHtml = (element,classRemove,classAdd) => {
        element.classList.remove(classRemove)
        element.classList.add(classAdd)
    }

    const playPauseMusic = () => { 
        btnPlayPause.addEventListener('click',() => { 
            if (isPlay) { 
                track.pause() 
                isPlay = false
                removeAndAddClassHtml(btnPlayPause.firstElementChild,'fa-pause','fa-play')
            }
            else if (isPlay != null) {  
                    track.play()
                    isPlay = true 
                    removeAndAddClassHtml(btnPlayPause.firstElementChild,'fa-play','fa-pause')
            }
            else playMusic(indexSongCurent)
            
        })
    }

    

    const mute = () => { 
        btnMute.addEventListener('click',() => {  
            if(isMute) { 
                removeAndAddClassHtml(btnMute.firstElementChild,'fa-volume-xmark','fa-volume-high')
                isMute = false 
                track.volume = curentVolume
                showVolumeElement.innerHTML = curentVolume*100
            }
            else { 
                removeAndAddClassHtml(btnMute.firstElementChild,'fa-volume-high','fa-volume-xmark')
                isMute = true
                curentVolume = track.volume 
                track.volume = 0 
                showVolumeElement.innerHTML = 0
            }
        })
    }
    const previousMusic = () => { 
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

    const eventMusic = () => { 
            choiceMusic()  
            getChangeVolume()
            clickNextMusic()
            clickPreviousMusic()
            playPauseMusic()
            mute()
            changeStatusMusic()
            checkEndMusic()
            eventSearch()
    }

    const getData = async (api) => { 
        try { 
            let dataJSON = await fetch(api) 
            data = await dataJSON.json() 
            data = data.songs.top100_VN[0].songs; 
            renderData(data)
            eventMusic()            
        }
        catch(error){
            console.error(error)
        }
    }

    const checkEndMusic = () => { 
        track.addEventListener('ended',() => { 
           nextMusic()
        })
    }

    const changeStatusMusic = () => { 
        statusMusic.addEventListener('change',() => { 
                track.currentTime = statusMusic.value
                showTimeAndStatusDuration()
        })
    }

    function showTimeAndStatusDuration() {
        statusMusic.max = track.duration
        if (curentInterval != null) { 
            clearInterval(curentInterval)
        }
        curentInterval = setInterval(()=>{
            statusMusic.value = track.currentTime
            showCurentTime.innerHTML = secondToMinuteSecond(track.currentTime)
        },1000)
    }


    
    const playMusic = (indexSong)=>{
            track.src = data[indexSong].music
            track.play()
            .then(()=>{
                isPlay = true
                if (previousIndexSong) { 
                    collectChildMp3[previousIndexSong].style.backgroundColor = '#170f23'
                } 
                previousIndexSong = curentIndexSong
                removeAndAddClassHtml(btnPlayPause.firstElementChild,'fa-play','fa-pause')
                showTimeAndStatusDuration()
                showTotalTime.innerHTML = secondToMinuteSecond(track.duration)
                collectChildMp3[curentIndexSong].style.backgroundColor = '#231c2d'
                updateInfoCurent(indexSong)
                
            })
            .catch((error) => {
                alert(error)
                nextMusic()
            })  
            
    }
    const choiceMusic = () => { 
        Array.prototype.forEach.call(collectChildMp3,(childMp3) => { 
            childMp3.addEventListener('click',(event)=>{ 
                curentIndexSong = event.target.getAttribute('index-song')
                playMusic(curentIndexSong)
            })
        })
    }

    const getChangeVolume = () => { 
        volume.addEventListener('change',(event) => { 
            const valumeAfterChange = event.target.value
            showVolumeElement.innerHTML = valumeAfterChange
            track.volume = valumeAfterChange/100 
            if (valumeAfterChange == 0) { // nếu valume điều chỉnh về 0
                removeAndAddClassHtml(btnMute.firstElementChild,'fa-volume-high','fa-volume-xmark')
            }
            else { 
                removeAndAddClassHtml(btnMute.firstElementChild,'fa-volume-xmark','fa-volume-high')
            }
        })
    }
    const renderData = (data) => { 
        let html = data.map((song,index)=>{ 
            return `
                <li index-song='${index}' class="child-mp3">
                <div>
                    <div class="img-mp3"><img src="${song.avatar}"></div>
                    <div>
                        <span>${song.title}</span> <span>${song.creator}</span>
                    </div>   
                </div>
                <div>
                    <span>${song.creator}</span>
                </div>
                <div>
                    <span id='duration-${index}'>03.12</span>
                </div>
            </li>
            `
        })
        detailMp3.innerHTML = html.join('')
    }

    // hàm hiển thị bài hát đang được phát. 

    const updateInfoCurent = (indexSongCurent) => {
        curentImage.src = data[indexSongCurent].avatar
        curentCreator.innerHTML = data[indexSongCurent].creator
        curentSongPlay.innerHTML = data[indexSongCurent].title
    }


    const eventSearch = () => { 
        search.addEventListener('keyup',(event) => { 
            
          
        })
    }

    return { 
        run:function() {  
            
            getData(api)
        }
    }
})(); 

app.run()


