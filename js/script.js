var buttonN = document.querySelector(".btnNext");
var buttonP = document.querySelector(".btnPrev");
var slider = document.querySelector(".slideMove");
var content = document.querySelector(".content");
var sum = 0;



slider.addEventListener("mouseover",function(e){
	buttonN.style.display = "block";
	buttonP.style.display = "block";
})
content.addEventListener("click",function(e){
	if(e.target.className=="btnNext"){
		sum++;
		var proc = sum*100;
		slider.style.right = proc+"%";
	};
	if(sum>=3){slider.style.right =0+"%"; sum=0;proc=0}
});
content.addEventListener("click",function(e){
	if(e.target.className=="btnPrev")
	if(sum>=1){
		sum--;
		var proc = sum*100;
		slider.style.right = proc+"%";
	}	
});
setInterval(function(){
	sum++;
		var proc = sum*100;
		slider.style.right = proc+"%";
	    if(sum>=3){slider.style.right =0+"%"; sum=0;proc=0;}
},15000)



