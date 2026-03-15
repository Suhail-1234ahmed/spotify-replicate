console.log('hello');

let currentsong = new Audio();
function secondsToTime(seconds) {
    seconds = Math.floor(seconds); // removes milliseconds

    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;

    return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/song/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/song/")[1])

        }

    }
    return songs
}
const playMusic = (track, pause = false) => {
    // let audio= new Audio("/song/"+track)
    currentsong.src = "/song/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main() {

    //get the list of all the song
    let songs = await getSongs()
    playMusic(songs[0], true)
    //show all the song in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
        <img class="invert" src="music-svgrepo-com.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")} </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img height="30px" src="play-svgrepo-com.svg" alt="">
                            </div></li>`
    }
    //add event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    //Attach a event listener to next previous and play button
    play.addEventListener("click", element => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "playsong.svg"
        }

    })
    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToTime(currentsong.currentTime)} / ${secondsToTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime) / (currentsong.duration) * 100 + "%"
    }
    )
    //add event listner on seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime= ((currentsong.duration)*percent)/100

    })

}
main() 