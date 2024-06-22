function render_page2(){
    let body=document.body;
    body.style.backgroundImage="url('images/canback3.jpg')";
    body.style.backgroundSize='cover';
    let b=1,s=1;//for storing the state of the speaker icon
    document.querySelector('.container').innerHTML=`<div class="main-container">
    <div class="container2">
        <div class="page2-icons">
            <button class="pause but">pause</button>
            <button class="restart but">Restart</button>
            <button class="quit but">Quit</button>
        </div>
        <div class="game-box">
            <canvas></canvas>
        </div>
        <div class="vol-container">
            <div class="vol">
                <input class="volume" type="range" min="0" max="100">
                <p class="volume-text">bullet</p>
                <input class="main-vol" type="range" min="0" max="100">
                <p class="volume-text">music</p>
                <input class="explosion-vol blast" type="range" min="0" max="100">
                <p class="volume-text">blast</p>
            </div>
        </div>
    </div>
    <div class="high">
    </div>
</div>`;

    window.game_run=true;//global variable
    document.querySelector('.quit').addEventListener('click',()=>{
        document.querySelector('.container').innerHTML='';
        body.style.backgroundImage='';
        game_run=false;
        if(game_run_count!=0){
            clearInterval(interval_bullet);
        clearInterval(interval_enemy);
        }
        main_audio.pause();
        render_mainpage();
    });

    //for getting butoon animation
    let div=document.querySelector('.but');
    div.addEventListener('click',()=>{
        div.classList.toggle('animate');
        setTimeout(()=>{
            div.classList.toggle('animate');
        },200);
    });


    game(700,600);
}