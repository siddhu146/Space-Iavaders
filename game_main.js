
function game(cw,ch){
    let canvas=document.querySelector('canvas');
    canvas.width=cw;
    canvas.height=ch;
    let object=canvas.getContext('2d');

    function render_text(s,text,x,y){
        object.font=`${s}px Arial`;
        object.fillStyle='yellow';
        object.fillText(text,x,y);
    }

    function render_heart(){
        let img=new Image();
        img.src='heart.svg';
            object.drawImage(img,20,20,30,30);
    }

    let text1=`Enter any key to start`;
    render_text(50,text1,120,300);

    let stored_score=localStorage.getItem('highscore');
    if(stored_score === null || stored_score === undefined){
        localStorage.setItem('highscore',0);
    }
    window.main_audio=document.querySelector('.game-music');
    main_audio.loop=true;
    main_audio.play();

    let gmusic=document.querySelector('.game-music');
    let back_audio=document.querySelector('.main-vol');
    back_audio.addEventListener('click',()=>{
        gmusic.volume=back_audio.value/100;
    })

    let count_to_stop_keydown_event=0;

    document.body.addEventListener('keydown',(event)=>{
        if(count_to_stop_keydown_event==0){
            play();
        }
         count_to_stop_keydown_event++;
    });

    window.game_run_count=0;

    function play(){
        game_run_count++;
        //Getting audio input from the document
        let audio=document.querySelector('.volume');
        audio.addEventListener('click',()=>{
            bulletsound.volume=audio.value/100;
        });

        let animationpause=false;

    //getting the source audio from the doc
        let bulletsound=document.querySelector('.bullet');
        let imgplayer = new Image();
        imgplayer.src = "images/ship.jpeg";


        //draw score box
        function score_box(){
            object.beginPath();
            object.lineCap="round";
            object.strokeStyle='blue';
            object.lineWidth=10;
            let a=cw/2-80;
            object.moveTo(a,0);
            object.lineTo(a+30,50);
            object.lineTo(a+130,50);
            object.lineTo(a+160,0);
            object.fillStyle='lightblue';
            object.fill();
            object.stroke();
        }

        //update score
        function score_display(w,x){
            object.font='33px Arial';
            object.fillStyle='green';
            let text=`${player1.score}`;
            object.fillText(text,w/2-10*x,33);
        }

        class player{
            constructor(x,y,color){
                this.x=x;
                this.y=y;
                this.color=color;
                this.score=0;
                this.lostcount=0;
            }
            draw(){
                     object.drawImage(imgplayer, this.x, ch-50, 70, 63);
            }
        };

        class bullet{
            constructor(x,y,color){
                this.x=x;
                this.y=y;
                this.color=color;
            }
            draw(){
                object.beginPath();
                object.moveTo(this.x,this.y);
                object.lineTo(this.x,this.y+20);
                object.strokeStyle=this.color;
                object.lineWidth=8;
                object.stroke();
            }
            update(){
                this.y-=3;
                this.draw();
            }
        }

        class enemy{
            constructor(x,y,img,w,h){
                this.x=x;
                this.y=y;
                this.img=img;
                this.width=w;
                this.height=h;
                if(Math.floor(Math.random()*2)+1==1){
                    this.d=1;
                }
                else this.d=-1;
            }
            draw(){
                    object.drawImage(this.img,this.x,this.y,this.width,this.height);
            }
            update(){
                this.y+=1;
                this.x+=this.d;
                if(this.x>=cw-this.width || this.x<=0) {
                    this.d=-this.d;
                }
                this.draw();
            }
        }

        document.addEventListener('keydown',(events)=>{
            if(events.key=='ArrowRight' && player1.x<cw-50){
                player1.x+=10;
            }
            else if(events.key=='ArrowLeft' && player1.x>0){
                player1.x-=10;
            }
        });


        let player1=new player(0,ch-50,'red');

        let bullet_array=[];

        //generating bullets
        function generate_bullet(h){
            window.interval_bullet=setInterval(()=>{
                if(!animationpause && game_run){
                    let newbullet=new bullet(player1.x+34,h-50,'red');
                    bullet_array.push(newbullet);
                    bulletsound.pause();
                    bulletsound.currentTime=0;
                    bulletsound.play();
                }
            },500);
        };
        generate_bullet(ch);


        let enemies=[];
        function genrate_enemy(cw){
            window.interval_enemy=setInterval(()=>{
                
                    if(!animationpause && game_run){
                        let x=Math.random()*(cw-200);
                        let y=0;
                        let a=Math.floor(Math.random()*3+1);
                        let img=new Image();
                        img.src=`images/stone${a}.png`;
                        let w=a*50;
                        let h=a*40;
                        let newenemy=new enemy(x,y,img,w,h,1);
                        enemies.push(newenemy);
                    }
            },800);
        }
        genrate_enemy(cw);

        let explosion=document.querySelector('.explosion');
        let explosion_vol=document.querySelector('.explosion-vol');
        explosion_vol.addEventListener('click',()=>{
            explosion.volume=explosion_vol.value/100;
        })

        function enemy_hit(){
            bullet_array.forEach((bullet)=>{
                enemies.forEach((stone)=>{
                    
                    let stonex=stone.x+stone.width/2;
                    let stoney=stone.y+stone.height/2;
                    if(Math.abs(bullet.x-stonex)<=stone.width/2 && Math.abs(bullet.y-stoney)<=stone.height/2){
                        player1.score++;

                        if(player1.score>stored_score){
                            stored_score++;
                            localStorage.setItem('highscore',stored_score);
                        }
                        let idb=bullet_array.indexOf(bullet);
                        bullet_array.splice(idb,1);
                        idb=enemies.indexOf(stone);
                        enemies.splice(idb,1);
                        explosion.pause();
                        explosion.currentTime=0;
                        explosion.play();
                    }
                })
            })
        };

    //making restart and quit button interactive
        let restart=document.querySelector('.restart');
        restart.addEventListener('click',()=>{
            bullet_array=[];
            player1.score=0;
            enemies=[];
            object.clearRect(0,0,cw,ch);
            player1.draw();
            player1.lostcount=0;
            score_box();
            score_display(cw,1);
            if(animationpause){
                animationpause=false;
                animate();
            }
            if(!game_run){
                game_run=true;
                animate();
            }
        })
        function animate(){
            if(!animationpause && game_run){
                    requestAnimationFrame(animate);
                    object.clearRect(0,0,cw,ch);
                bullet_array.forEach((bullet1)=>{
                    if(bullet1.y>-10){
                        bullet1.update();
                    }
                    else{
                        let id=bullet_array.indexOf(bullet1);
                        bullet_array.splice(id,1);
                    }
                });
                enemy_hit();
                player1.draw();
                enemies.forEach((stone)=>{
                    if(stone.y<ch+30){
                        stone.update();
                    }
                    else{
                        let id=enemies.indexOf(stone);
                        enemies.splice(id,1);
                        player1.lostcount++;
                    }
                });
                score_box();
                if(player1.score<10) score_display(cw,1);
                if(player1.score<100 && player1.score>=10) score_display(cw,2);
                if(player1.score>=100) score_display(cw,3);
            }
            render_heart();
            let t='×';
            t+=JSON.stringify(6-player1.lostcount);
            render_text(30,t,49,45);
            game_over();
        };
        let gameover_sound=document.querySelector('.game-over');
        function game_over(){
            if(player1.lostcount>5){
                bullet_array=[];
                enemies=[];
                object.clearRect(0,0,cw,ch);
                game_run=false;
                player1.lostcount=0;
                player1.draw();
                score_box();
                if(player1.score<10) score_display(cw,1);
                if(player1.score<100 && player1.score>=10) score_display(cw,2);
                if(player1.score>=100) score_display(cw,3);
                gmusic.pause();
                gmusic.currentTime=0;
                gameover_sound.play();
                let texta=`GAME OVER`;
                let textb=`Your score ${player1.score}`;
                let textc=`High score ${localStorage.getItem('highscore')}`;
                 render_text(80,texta,100,150);
                 render_text(50,textb,190,300);
                 render_text(50,textc,190,350);
                 let t='×0';
                render_text(30,t,49,45);
            }
        }
        document.querySelector('.pause').addEventListener('click',()=>{
            if(animationpause){
                animationpause=false;
                
                animate();
            }
            else{ 
                animationpause=true;
            }
        });
        animate();
    }

}
