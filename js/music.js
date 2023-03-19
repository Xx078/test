//记录当前播放歌曲的索引
var musicIndex=0;
onload=function(){
	audio=document.getElementById("music");
	jindutiao=document.getElementById("jindutiao");
	fm=document.getElementById("fengmiantupian");
	bofang=document.getElementById("bofang");

	//加载歌曲列表	
	loadMusicList();
	//初始化音频对象
	initAudio();
	//2.歌曲播放
	bofang.onclick=playAndPaused;
	//3.进度条随时长变化发生变化
	audio.ontimeupdate=jindutiaoupdate;
	//4.切换歌曲
	document.getElementById("front").onclick=front;
	document.getElementById("next").onclick=next;
	//5.加载歌词
	geCi();
	//6.歌词设置
	linghtGeCi();
	//7.音量设置
	document.querySelector('#yinliang').onclick=viewyinliang;
	document.querySelector('#volume-range').oninput=changeyinliang
}
//加载歌曲列表
function loadMusicList(){
	//获取歌曲列表的ul标签
	var ul=document.querySelector(".song-list");
	ul.innerHTML="";
	musicData.forEach(function(music,index){
		var li=document.createElement("li");
		if(index==musicIndex){
			li.className="current";
		}
		li.innerText=`${music.song}-------${music.singer}`;
		ul.appendChild(li);
	})
}
//时长转换函数
function formate(second){
	var str="";
	var min=parseInt(second/60);
	var sec=parseInt(second%60);
	str=(min<10?"0"+min:min)+":"+(sec<10?"0"+sec:sec);
	return str;
}
//初始化音频
function initAudio(){
	audio.src=musicData[musicIndex].url;
	audio.oncanplay=function(){
		//设置歌曲的时长
		var durationStr=formate(audio.duration);
		document.getElementById("span-duration").innerText=durationStr;
		//进度条的总时长
		jindutiao.max=parseInt(audio.duration);
		//封面
		fm.src=musicData[musicIndex].cover;
		//歌名
		document.getElementById("mingzi").innerText=musicData[musicIndex].song;
		//音量设置
		document.getElementById("volume-range").value=audio.volume;
	}
	//进度条时长初始化为0
	jindutiao.value=0;
}
//歌曲播放
function playAndPaused(){
	if(audio.paused){
		audio.play();
		bofang.style.backgroundPositionX="-50px";
		fm.style.animationPlayState="running";
	}else{
		audio.pause();
		bofang.style.backgroundPositionX="0";
		fm.style.animationPlayState="paused";
	}

}
//进度条
function jindutiaoupdate(){
	//拖拽进度条变化时长
	jindutiao.oninput=function(){
		//进度条的值设置为当前的播放速度
		audio.currentTime=jindutiao.value;
	}
	jindutiao.value=audio.currentTime;
	var currentTimeStr=formate(audio.currentTime);
	document.getElementById("span-current-time").innerText=currentTimeStr;
	//进度条
	if(audio.currentTime==audio.duration){
		bofang.style.backgroundPositionX="0";
		fm.style.animationPlayState="paused";
		jindutiao.value=0;
	}
	linghtGeCi();
}
//上一首
function front(){
	if(musicIndex==0){
		musicIndex=3;
	}else{
		musicIndex=musicIndex-1;
	}
	initAudio();
	playAndPaused();
	loadMusicList();
	geCi();
	linghtGeCi();
}
//下一首
function next(){
	musicIndex=(musicIndex+1)%4;
	initAudio();
	playAndPaused();
	loadMusicList();
	geCi();
	linghtGeCi();
}
//加载歌词
function geCi(){
	var geciUl=document.getElementById("geci");
	geciUl.innerHTML="";
	lrcs[musicIndex].lyric.forEach(function(geci,index){
		var li=document.createElement("li");
		li.setAttribute("index",index+1);
		li.className=`geci-${geci.time}`;
		li.innerText=geci.lineLyric;
		geciUl.appendChild(li);
	})
}
//歌词设置
function linghtGeCi(){
	//获取当前播放时间
	var currTime=parseInt(audio.currentTime);
	//获取被点亮歌词
	var currLi=document.querySelector(`.geci-${currTime}`);
	if(currLi){
		var lis=document.querySelectorAll("#geci .current");
		for(var i=0;i<lis.length;i++){
			//清除其他标签颜色
			lis[i].className=lis[i].className.replace(" current","");
		}
		currLi.className=currLi.className+" current";
		var index=currLi.getAttribute("index");
		//移动歌词
		if(index>5){
			var geciUl=document.getElementById("geci");
			geciUl.style.top=(5-index)*40+"px";
		}
	}
}
//音量设置
function viewyinliang(){
	var voice=document.getElementById("yinliangtiao");
	if(voice.style.display=="block"){
		voice.style.display="none";
	}else{
		voice.style.display="block";
	}
}
function changeyinliang(){
	//音频播放器音量
	audio.volume = this.value;
}