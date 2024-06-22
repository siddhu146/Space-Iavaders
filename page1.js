
//function fpor rendering main page 
function render_mainpage(){
    let body=document.body;
    body.style.backgroundImage="url('images/back_main.jpg')";
    body.style.backgroundSize='cover';
    let html='';
    html+=`<h1 class="heading">Space Invaders</h1>`
    html+=`<button class="start">Play Game</button>`
    document.querySelector('.container').innerHTML=html;

    let div=document.querySelector('.start');
    div.addEventListener('click',()=>{

        let sound=document.querySelector('.game-start-sound');
        sound.play();

        div.classList.toggle('translate');
        setTimeout(()=>{
            div.classList.toggle('translate');
        },200);
        body.style.backgroundImage="";
        document.querySelector('.container').innerHTML='';
        render_page2();
    })
}
render_mainpage();