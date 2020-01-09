function Prom() {
	this.onOk = null;
	this.onFail = null;
	this.then = function (complete, error) {
		this.onOk = complete;
		this.onFail = error;
	};
	this.good = function (data) {
		if (this.onOk) {
			this.onOk(data)
		};
	};
	this.bad = function (message) {
		if (this.onFail) {
			this.onFail(message)
		};
	};
};

function CreateUser(name, pass) {
	this.type = "user";
	this.name = name;
	this.pass = pass;
	this.active = false;
	this.admin = false;
};

function AddProducts(prodType,model,quant,price,img){
	this.type = "product";
	this.prodType = prodType;
	this.model = model;
	this.quant = quant;
	this.price = price;
	this.img = img;
};
AddProducts.prototype.selector = function(prodClass){	
			this.__proto__=prodClass
};

function Monitor(size){
	this.id = "Monitor"
	this.size = size;
};
function Laptop(cpu,ram,hdd){
	this.id = "Laptop";
	this.cpu = cpu;
	this.ram = ram;
	this.hdd = hdd;
}

//////////////////////////////////////////////////////
function serv(data) {
	var pro = new Prom();
	var interval = setInterval(function () {
		pro.good(data);
		clearInterval(interval)
	}, 1000);
	return pro;
};
var arr = {
	 userArr:[],
	 prodArr:[]
};
var request = {
	post: function (data) {
		serv(data).then(function (data) {
			if(data.type=="user"){arr.userArr.push(data)};
			if(data.type=="product"){arr.prodArr.push(data)};
		})
	},
	get: function (fn) {
		serv(arr).then(function (data) {
			fn(data)
		})
	}
};


////////////////////////////////////////////////////

var page = {
	init: function () {
		this.user.add();
		this.product.addProduct();
	}
};
page.user = {
	add: function () {
		var regBtn = document.querySelector(".regBtn");
		var enterBtn = document.querySelector(".enterBtn");
		var exitBtn = document.querySelector(".exitBtn");
		var showU = document.querySelector(".show");
		var DpBtn = document.querySelector(".delBtn");
		this.event = rxjs.fromEvent(regBtn, "click").subscribe(this.newUser.bind(this));
		this.event = rxjs.fromEvent(enterBtn, "click").subscribe(this.validUser.bind(this));
		this.event = rxjs.fromEvent(exitBtn, "click").subscribe(this.exitUser.bind(this));
		this.event = rxjs.fromEvent(showU, "click").subscribe(this.showUsers.bind(this));
		this.event = rxjs.fromEvent(window, "contextmenu").subscribe(this.userTest.bind(this));
	},
	newUser: function () {
		var regLog = document.querySelector(".loginReg");
		var regPass = document.querySelector(".passwordReg")
		var name = regLog.value;
		var pass = regPass.value;
		var userObj = new CreateUser(name, pass);
		this.compareUser(userObj);
	},
	compareUser: function(user){
		request.get(function(ar){
			var send = true;
			if(ar.userArr.length>=0){
				ar.userArr.forEach(function(elem){
					if(elem.name==user.name){alert("это имя уже занято"); send = false};
					if(elem.pass==user.pass){alert("этот пароль уже занят"); send = false}
					else{send = true} 
				})
			}
			else{send = true};
			if(send==true){request.post(user)}
		})
	},
	
	validUser: function () {
		var valUsLog = document.querySelector(".loginEnter");
		var valUsPass = document.querySelector(".passwordEnter");
		var activeUser = new CreateUser(valUsLog.value, valUsPass.value);
		var sum = 0;
		request.get(function (ar) {
            ar.userArr.some(function(elem){
				if(elem.name==activeUser.name){return sum++}
			})
			if(sum<1) return alert("wrong log") 
			else {
			ar.userArr.filter(function (elem) {
				if (elem.name == activeUser.name){ return elem}
			}).map(function (elem) {
				if (elem.pass == activeUser.pass) {elem.active=true} else{alert("wrong pass")};
			})};
			
			ar.userArr.map(function(elem){
				var adminName = "admin";
                var summ = 0;
				for(var i = 0;i<=adminName.length;i++){
					for(var g =0;g<=adminName.length;g++){
						if(elem.name[g]!=undefined)
						if(adminName[i]==elem.name[g]){summ++}
						if(summ>=adminName.length){elem.admin=true};
					}
				};//console.log(summ);
			})
		})
	},
	exitUser: function(){
		request.get(function(ar){
			ar.userArr.filter(function(elem){
				if(elem.active==true){elem.active=false};
			})
		})
	},
	userTest:function(){
		request.get(function(ar){
				ar.userArr.filter(function(elem){
					if(elem.active==true){alert(elem.name+" "+" купил ноут")}
				})
			}
	)},
	showUsers: function(){
		request.get(function(ar){
			console.log(ar.userArr)		
	  })
	}
	
},
page.product = {
	addProduct: function(){
		var addPb=document.querySelector(".addP");
		this.event = rxjs.fromEvent(addPb, "click").subscribe(this.newProduct.bind(this));
		this.event = rxjs.fromEvent(addPb, "contextmenu").subscribe(this.prodRedraw.bind(this));
	},
	newProduct:function(){
		var typeProd = prompt("product type");
		var modeL = prompt("model");
		var quantaty = prompt("quantaty");
		var price = +prompt("price");
		var image = prompt("set image");
		var productObj = new AddProducts(typeProd,modeL,quantaty,price,image);
		if (typeProd=="monitor"){
			var sizze = prompt("set size");
			var MonitorObj = new Monitor(sizze);
			productObj.selector(MonitorObj);
		}
		if (typeProd=="laptop"){
			var cpU = prompt("set cpu");
			var raM = prompt("set ram");
			var hdD = prompt("set hdd");
			var LaptopObj = new Laptop(cpU,raM,hdD);
			productObj.selector(LaptopObj);
		};
		request.post(productObj);
	},
	prodElem:function(c,pO){
	    var items = document.createElement("DIV");
		var img = document.createElement("DIV");
		var desc = document.createElement("DIV");
		var bb = document.createElement("INPUT");
		var bDel = document.createElement("INPUT");
		bb.setAttribute("type","button")
		bDel.setAttribute("type","button")
		bb.setAttribute("value","купить")
		bb.setAttribute("id",pO.model)
		bDel.setAttribute("id",pO.model)
		bDel.setAttribute("value","удалить")
		items.className="items"
		img.className="img";
		desc.className="desc";
		bb.className="addBtn";
		bDel.className="delBtn";
		//console.log(bb.id)
		img.style.background=pO.img;
		desc.insertAdjacentHTML("afterBegin",pO.price);
		desc.insertAdjacentHTML("afterBegin",pO.model);
		
		items.appendChild(img);
		items.appendChild(desc);
		items.appendChild(bb);
		items.appendChild(bDel);
		c.appendChild(items);
	},
	prodRedraw:function(){
	    var container = document.querySelector(".prodCont");
		container.innerHTML='';
		request.get(function(ar){
			ar.prodArr.map(function(elem){
				page.product.prodElem(container,elem)
			});
		})
		}
	}


rxjs.fromEvent(window, "load").subscribe(page.init.bind(page));
