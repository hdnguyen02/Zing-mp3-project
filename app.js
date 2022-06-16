
const app = (function(){
    const api = 'https://api.apify.com/v2/key-value-stores/EJ3Ppyr2t73Ifit64/records/LATEST?fbclid=IwAR39d_x0QCUHtb9AQ21dai2Qz_SOgI3KzSlkts-JDarbLey-gvet8jjbY4w'
    
    const $id = document.getElementById.bind(document) 
    const detailMp3 = $id('detail-mp3')  //  thẻ ul chứa khu vực mp3 
    const volume = $id('volume') 
    const showVolumeElement = $id('show-volume')  
    const btnPrevious = $id('previous')
    const btnPlayPause = $id('play-pause')
    const btnNext = $id('next')
    const btnMute = $id('mute')
    const showTotalTime = $id('total-time')
    const showCurentTime = $id('curent-time')
    const statusMusic = $id('status-music')
    const curentImage = $id('curent-image')
    const curentSongPlay = $id('curent-song-play')
    const curentCreator = $id('curent-creator')
    const search = $id('search')
    const BoxResult = $id('show-result')
    const collectChildMp3 = document.getElementsByClassName('child-mp3') // chứa các li (child-mp3)
    const track = document.createElement('audio')
    let data = {}
    let curentInterval = null
    let curentIndexSong = 0 
    let isPlay = null 
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
                removeAndAddClassHtml(btnPlayPause.firstElementChild,'fa-play','fa-pause')
                showTimeAndStatusDuration()
                showTotalTime.innerHTML = secondToMinuteSecond(track.duration)
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
                        <span class='title-song'>${song.title}</span> <span>${song.creator}</span>
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

    // Viết hàm kiểm tra xem có kết quả hay không 
    const showSongSearch = (resultHtml) => {
        let elementShow
        if (resultHtml.length) {
            elementShow = resultHtml.join('')
        }
        else { 
            // trường hợp không có -> lấy kết quả hiện tại hiển thị lên 
            elementShow = `<li>${search.value}</li>`
        }
        // hien thi len 
        BoxResult.innerHTML = elementShow
    }

    
   


    const eventSearch = () => { 
        search.onkeyup = (event) => { 
            const valueInput = event.target.value.toLowerCase() 
            if (valueInput) {
                let resultMatch = Array.prototype.filter.call(collectChildMp3,(childMp3) => { 
                    let titleSong = childMp3.querySelector('.title-song').textContent.toLowerCase()
                    return titleSong.startsWith(valueInput)
                })

                let resultHtml = resultMatch.map((resultChild) => {
                    return `<li index-song="${resultChild.getAttribute('index-song')}"
                        class="result-child"
                    >${
                        resultChild.querySelector('.title-song').textContent
                    }</li>`
                })
                showSongSearch(resultHtml)
                let totalResult = document.getElementsByClassName('result-child')
                Array.prototype.forEach.call(totalResult,(child) => { 
                    child.addEventListener('click',() => { 
                        playMusic(child.getAttribute('index-song'))
                        BoxResult.innerHTML = ''
                        search.value = ''
                    })
                })
            }
            else { 
                BoxResult.innerHTML = ''
            }
        }
    }

    

    return { 
        run:function() {  
            
            getData(api)
        }, 
        
    }
})(); 

app.run()



