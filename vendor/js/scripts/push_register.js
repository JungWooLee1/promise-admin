
$( function() {
  $( ".datepicker" ).datepicker();
  $( ".datepicker2" ).datepicker();



});

<!-- region-module.js -->
var cnt = new Array();
cnt[0] = new Array('전지역');
cnt[1] = new Array('전체','강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구');
cnt[2] = new Array('전체','강서구','금정구','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구','기장군');
cnt[3] = new Array('전체','남구','달서구','동구','북구','서구','수성구','중구','달성군');
cnt[4] = new Array('전체','계양구','남구','남동구','동구','부평구','서구','연수구','중구','강화군','옹진군');
cnt[5] = new Array('전체','광산구','남구','동구','북구','서구');
cnt[6] = new Array('전체','대덕구','동구','서구','유성구','중구');
cnt[7] = new Array('전체','남구','동구','북구','중구','울주군');
cnt[8] = new Array('전체','고양시','과천시','광명시','구리시','군포시','남양주시','동두천시','부천시','성남시','수원시','시흥시','안산시','안양시','오산시','의왕시','의정부시','평택시','하남시','가평군','광주시','김포시','안성시','양주군','양평군','여주군','연천군','용인시','이천군','파주시','포천시','화성시');
cnt[9] = new Array('전체','강릉시','동해시','삼척시','속초시','원주시','춘천시','태백시','고성군','양구군','양양군','영월군','인제군','정선군','철원군','평창군','홍천군','화천군','황성군');
cnt[10] = new Array('전체','제천시','청주시','충주시','괴산군','단양군','보은군','영동군','옥천군','음성군','진천군','청원군');
cnt[11] = new Array('전체','공주시','보령시','서산시','아산시','천안시','금산군','논산군','당진군','부여군','서천군','연기군','예산군','청양군','태안군','홍성군');
cnt[12] = new Array('전체','군산시','김제시','남원시','익산시','전주시','정읍시','고창군','무주군','부안군','순창군','완주군','임실군','장수군','진안군');
cnt[13] = new Array('전체','광양시','나주시','목포시','순천시','여수시','여천시','강진군','고흥군','곡성군','구례군','담양군','무안군','보성군','신안군','여천군','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군');
cnt[14] = new Array('전체','경산시','경주시','구미시','김천시','문겅시','상주시','안동시','영주시','영천시','포항시','고령군','군위군','봉화군','성주군','영덕군','영양군','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군');
cnt[15] = new Array('전체','거제시','김해시','마산시','밀양시','사천시','울산시','진주시','진해시','창원시','통영시','거창군','고성군','남해군','산청군','양산시','의령군','창녕군','하동군','함안군','함양군','합천군');
cnt[16] = new Array('전체','서귀포시','제주시','남제주군','북제주군');

function change(add) {
  let sel=document.getElementById('county');
  console.log(sel);
  for (let i=sel.length-1; i>=0; i--){
    sel.options[i] = null
  }
  for (let i=0; i < cnt[add].length;i++){
    sel.options[i] = new Option(cnt[add][i], cnt[add][i]);
  }
}

<!-- input-textarea-module.js -->
$(function() {
  $('#content').keyup(function (e){
    var content = $(this).val();
    $(this).height(((content.split('\n').length + 1) * 1.5) + 'em');
    $('#counter').html(content.length + '/300');
  });
  $('#content').keyup();
});


var upload = document.getElementById('input-image'),
    holder = document.getElementById('holder');

upload.onchange = function (e) {

  console.log('onchange 호출');
  e.preventDefault();

  var file = upload.files[0],
      reader = new FileReader();
  reader.onload = function (event) {
    var img = new Image(300, 300);
    img.src = event.target.result;
    // note: no onload required since we've got the dataurl...I think! :)
    holder.innerHTML = '';
    console.log('이미지 추가!');
    holder.appendChild(img);
  };
  reader.readAsDataURL(file);

  return false;
};

// 유효성 검사를 수행합니다.
// rules : 기본적인 규칙
// message : 검사 에러시 표시할 메세지
// errorElement : 에러 메세지 element의 유형
// errorPlacement : 에러 메세지의 표시위치 및 속성


$(document).ready(function() {
  console.log("validate 수행");
  $("#popup_form").validate({
    rules: {
      title: "required",
      link: "required",
      number: "required",
      start_date: "required",
      end_date: "required"
    },
    messages :{
      //title: "please enter your title"
      file : 'select file'
    },
    errorElement: "em",
    errorPlacement: function ( error, element ) {
      // Add the `help-block` class to the error element
      error.addClass( "is-invaild" );
      if ( element.prop( "type" ) === "checkbox" ) {
        error.insertAfter( element.parent( "label" ) );
      } else {
        error.insertAfter( element );
      }
    },
    unhighlight: function ( element, errorClass, validClass ) {
      console.log('하이라이트 수행?');
      console.log(element);
      $( element ).addClass( "is-valid" ).removeClass( "is-invalid" );
      $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
    },
    highlight: function ( element, errorClass, validClass ) {
      $( element ).addClass( "is-invalid" ).removeClass( "is-valid" );
      $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
    },
  });
});
