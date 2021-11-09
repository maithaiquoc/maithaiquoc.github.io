let base_url = window.location.origin + '/' + window.location.pathname.split ('/') [1] + '/';
var thirdPrizeList = [];
var secondPrizeList = [];
var firstPrizeList = [];
var numberList = [];
var confetti;

// outline preparation
$(function(){
    var width = window.innerWidth;
    if(width < 992){
        $("#divMain")
            .css("color", "white")
            .html("Phiên bản hiện tại không hỗ trợ trên thiết bị của bạn. </br> Vui lòng sử dụng thiết bị có kích cỡ màn hình lớn hơn (PC/Laptop).");
    }

    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });

    $("#divLuckyDrawContainer, #divLuckyDrawContainer > .tab-content, #divLuckyDrawContainer > .tab-content > #ThirdPrize").addClass("px-0");

    $("#btnStart").click(function () {
        $("#divStartContainer, #pDes").fadeOut(3000);
        setMachineData(1, 10);
        setTimeout(function () {
            $("#btnPlay, #sgcSlogan").removeClass("d-none");
            $("#h3Title").html('Lần Quay Thứ <span id="spnOrder">1</span>');
            $("#pDes").html('Mỗi giải 01 phiếu mua hàng <span id="spnDes">500.000đ</span>').removeClass("mt-5 mb-4").fadeIn();
            $("#divDrawContainer").removeClass("d-none");
        }, 2000)
    });

    // confetti
    const confetti = document.getElementById('confetti');
    const confettiCtx = confetti.getContext('2d');
    let container, confettiElements = [], clickPosition;
    rand = (min, max) => Math.random() * (max - min) + min;
    const confettiParams = {
        // number of confetti per "explosion"
        number: 70,
        // min and max size for each rectangle
        size: { x: [5, 20], y: [10, 18] },
        // power of explosion
        initSpeed: 25,
        // defines how fast particles go down after blast-off
        gravity: 0.65,
        // how wide is explosion
        drag: 0.08,
        // how slow particles are falling
        terminalVelocity: 6,
        // how fast particles are rotating around themselves
        flipSpeed: 0.017,
    };
    const colors = [
        { front : '#c32aa3', back: '#4c5fd7' },
        { front : '#7232bd', back: '#f46f30' },
        { front : '#ffdc7d', back: '#fde5bf' },
        { front : '#dfec97', back: '#c39485' },
        { front : '#7b5be9', back: '#ff7084' },
        { front : '#f47e50', back: '#6fbc76' },
        { front : '#ffcc00', back: '#0089c0' },
    ];

    setupCanvas();
    updateConfetti();

    confetti.addEventListener('click', addConfetti);
    window.addEventListener('resize', () => {
        setupCanvas();
        hideConfetti();
    });

    function Conf() {
        this.randomModifier = rand(-1, 1);
        this.colorPair = colors[Math.floor(rand(0, colors.length))];
        this.dimensions = {
            x: rand(confettiParams.size.x[0], confettiParams.size.x[1]),
            y: rand(confettiParams.size.y[0], confettiParams.size.y[1]),
        };
        this.position = {
            x: clickPosition[0],
            y: clickPosition[1]
        };
        this.rotation = rand(0, 2 * Math.PI);
        this.scale = { x: 1, y: 1 };
        this.velocity = {
            x: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.4,
            y: rand(-confettiParams.initSpeed, confettiParams.initSpeed)
        };
        this.flipSpeed = rand(0.2, 1.5) * confettiParams.flipSpeed;

        if (this.position.y <= container.h) {
            this.velocity.y = -Math.abs(this.velocity.y);
        }

        this.terminalVelocity = rand(1, 1.5) * confettiParams.terminalVelocity;

        this.update = function () {
            this.velocity.x *= 0.98;
            this.position.x += this.velocity.x;

            this.velocity.y += (this.randomModifier * confettiParams.drag);
            this.velocity.y += confettiParams.gravity;
            this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
            this.position.y += this.velocity.y;

            this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
            this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
        }
    }

    function updateConfetti () {
        confettiCtx.clearRect(0, 0, container.w, container.h);

        confettiElements.forEach((c) => {
            c.update();
            confettiCtx.translate(c.position.x, c.position.y);
            confettiCtx.rotate(c.rotation);
            const width = (c.dimensions.x * c.scale.x);
            const height = (c.dimensions.y * c.scale.y);
            confettiCtx.fillStyle = c.color;
            confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
            confettiCtx.setTransform(1, 0, 0, 1, 0, 0)
        });

        confettiElements.forEach((c, idx) => {
            if (c.position.y > container.h ||
                c.position.x < -0.5 * container.x ||
                c.position.x > 1.5 * container.x) {
                confettiElements.splice(idx, 1)
            }
        });
        window.requestAnimationFrame(updateConfetti);
    }

    function setupCanvas() {
        container = {
            w: confetti.clientWidth,
            h: confetti.clientHeight
        };
        confetti.width = container.w;
        confetti.height = container.h;
    }

    function addConfetti(e) {
        const canvasBox = confetti.getBoundingClientRect();
        if (e) {
            clickPosition = [
                e.clientX - canvasBox.left,
                e.clientY - canvasBox.top
            ];
        } else {
            clickPosition = [
                canvasBox.width * Math.random(),
                canvasBox.height * Math.random()
            ];
        }
        for (let i = 0; i < confettiParams.number; i++) {
            confettiElements.push(new Conf())
        }
    }

    function hideConfetti() {
        confettiElements = [];
        window.cancelAnimationFrame(updateConfetti)
    }

    confettiLoop();
    function confettiLoop() {
        addConfetti();
        setTimeout(confettiLoop, 800 + Math.random() * 1800);
    }

    $("#confetti").hide();

    function afterModalTransition(e) {
        e.setAttribute("style", "display: none !important;");
        $("#btnClose").click();
    }
    $('#divConfettiModal').on('hide.bs.modal', function (e) {
        setTimeout( () => afterModalTransition(this), 200);
    });

    playAudioAfter9sec();
});

// data preparation
$(function(){
    $("#aThirdPrize").click(function () {
        var order = parseInt($("#hidOrder3").val());
        $("#spnOrder").text(order+1);

        $("#divLuckyDrawContainer, #divLuckyDrawContainer > .tab-content, #divLuckyDrawContainer > .tab-content > #ThirdPrize").addClass("px-0");
        $("#imgConfetti").attr("src", "images/third-confetti-popup.jpg");
    });

    // run lucky draw machine
    $("#btnPlay").click(function() {
        $(this).prop("disabled", true);
        var order = parseInt($("#hidOrder3").val());
        $(this).text("Tiếp tục");

        if(order == 0) {
            $("#hidOrder3").val(order+1);
            runMachineData( 10);
        }
        else{
            if($("#hidContinue3").val() == 1){
                $("#spnOrder").text(order+1);
                $("#hidOrder3").val(order+1);
                $("#hidThirdPrizeData1").val(0);
                setMachineData((order+1), 10);
                $("#hidContinue3").val(0);
            }
            else{
                runMachineData(10);
                $("#hidContinue3").val(1);
            }
        }

        if (order == 10) $(this).text("Quay số").addClass("d-none");
    });

    // close confetti
    $("#confetti").click(function () {
        $("#btnClose").click();
    });
    $("#btnClose").click(function () {
        $("#confetti").css("display", "none");
        $("#divConfettiModal").css("z-index", 1);
        clearTimeout(confetti);

        var order = parseInt($("#hidOrder3").val());
        if(order == 10){
            firstPrizeList.forEach(function (phone) {
                $("#mqFirstPrize").append('<span>'+phone+'</span><br/>');
            });
            secondPrizeList.forEach(function (phone) {
                $("#mqSecondPrize").append('<span>'+phone+'</span><br/>');
            });
            thirdPrizeList.forEach(function (phone) {
                $("#mqThirdPrize").append('<span>'+phone+'</span><br/>');
            });

            setTimeout(function () {
                $("#divMain").fadeOut();
                $("#divConfetti").removeClass("d-none");
            }, 1000);

            setTimeout(function () {
                $("#divExportModal").css("z-index", 999999).modal();
            }, 5000);
        }
    });

    // export list
    $("#btnPrize3").click(function () {
        exportList(thirdPrizeList, "thirdPrizeList");
    });
});

function exportList(prizeData, prizeName) {
    var fileName = prizeName+".csv";
    var table = prizeData;

    if ("download" in document.createElement("a")) {
        var link = $("<a target='_blank' href='data:text/csv;charset=utf-8,%EF%BB%BF"
            + encodeURI(table.join("\n")) + "' download='" + fileName + "'></a>");
        link.appendTo("body");
        link[0].click();
        setTimeout(function () {
            link.remove();
        }, 50);
        return;
    }

    var txt = $("<textarea cols='65536'></textarea>").get(0);
    txt.innerHTML = table.join("\n");
    var frame = $("<iframe src='text/csv;charset=utf-8' style='display:none'></iframe>").appendTo("body").get(0);
    frame.contentWindow.document.open("text/csv;charset=utf-8", "replace");
    frame.contentWindow.document.write(txt.value);
    frame.contentWindow.document.close();
    frame.contentWindow.document.execCommand("SaveAs", true, fileName);
    setTimeout(function () {
        $(frame).remove();
        $(txt).remove();
    }, 50);
}

function showConfettiPopup(time=1000) {
    confetti = setTimeout(function () {
        if($("#confetti").css("display") == "none") $("#confetti").show();
        $("#divConfettiModal").css("z-index", 9999).modal();
    }, time);
}

function playAudioAfter9sec(){
    let audio = document.getElementById('audLuckyDraw');
    audio.muted = false;
    audio.autoplay = true;
    audio.currentTime = 9;
    audio.play();
}

function onComplete(active) {
    var id = this.element.id;
    var machine = id.substring(0, 7);
    var number = parseInt(id.substring(7, id.length))+1;
    var phone = getMachineResult(id, active);

    if(number%10 == 0) $("#btnPlay").prop("disabled", false);

    thirdPrizeList.push(phone);

    if(number == 100){
        $("#imgConfetti").attr("src", "images/third-confetti-popup.png");
        $("#imgConfetti").attr("width", "60%");
        $("#imgConfetti").attr("height", "60%");
    }
    showConfettiPopup();
}

function getMachineResult(i_jqMachine, i_iActive){
    return $("#"+i_jqMachine).find('span.option > span').eq(i_iActive + 1).text();
}

function runMachineData(numbers) {
    var order = parseInt($("#hidOrder3").val());
    if(order == 0) order = 1;
    var index = 1;
    var mc = "control";
    $("#ThirdPrize"+index+" .optionSpan").remove();
    $("#ThirdPrize"+index+" .option").removeClass("d-none");
    for (var i = (numbers*(order-1)); i < (numbers*order); i++) {
        var machine = $("#ThirdPrize"+index+" #"+mc+i).slotMachine({
            active: i,
            delay: 80,
        });
        machine.shuffle(150, onComplete);
    }
}

function setMachineData(order, numbers) {
    numberList = [];
    var index = 1;
    var machine = "control";
    $("#ThirdPrize1 > .machine > .wrap").html("");
    $("#btnPlay").text("Quay số").prop("disabled", false);
    var customer_list;
    $.get(base_url + "data/ds_ngay12.csv", function (csv) {
        customer_list = $.csv.toArrays(csv, {
            onParseValue: $.csv.hooks.castToScalar
        });

        for (var i=(numbers*(order-1)); i<(numbers*order); i++) { // each column (10 phone numbers) is unique
            var prizeData = '<div class="column"><div id="'+machine+i+'" class="optionContainer">';
            prizeData += '<span class="option optionSpan"><span>'+(i+1)+'</span></span>';
            var randomList = getOrderedList(customer_list);
            randomList.forEach(function (value) {
                prizeData += '<span class="option d-none"><span>'+value+'</span></span>';
            });
            prizeData += '</div></div>';
            $("#ThirdPrize"+index+" > .machine > .wrap").append(prizeData);
        }
        $("#hidThirdPrizeData"+index).val(1);
    });
}

function getOrderedList(customerList) { // return 10 unique phone numbers
    var prizeList = thirdPrizeList.concat(secondPrizeList).concat(firstPrizeList).concat(numberList);
    var randomList = [];
    while(randomList.length < 10){
        var r = getRandomInt(1, (customerList.length)-1);
        var phone = customerList[r][0].toString();
        var zero_str = "";
        if(phone.length < 13){
            var zero_len = 13 - phone.length;
            for(var i=0; i<zero_len; i++){
                zero_str += "0";
            }
        }
        phone = zero_str+customerList[r][0];
        if(randomList.indexOf(phone) === -1 && prizeList.indexOf(phone) === -1){
            randomList.push(phone);
            numberList.push(phone);
        }
    }

    return randomList;
}

function getRandomInt(min, max) {
    var r = new Random();
    var number = r.Next(min, max);
    return number;
}
