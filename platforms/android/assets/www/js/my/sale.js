$(document).ready(function(){

	//$("#saleFail").hide();
	$("#loading").hide();
	$("#showExtendIncentive").hide();	

//sekisuri_150130 월청구금액 버튼 모달   <START
/* my_validate.js 로 옴김
	$("#btnModal").click(function(){
		$("#myModal").modal('show');
	});
	$("#btn_closeModal").click(function(){
		$("#myModal").modal('hide');
		$("#selectTelecom").val("none");
		$("#selectType").val("none");
		$("#selectModel").val("none");
		$("#selectCharge").val("none");

		//가격 리셋 
		$("#origin_price").val("");
		$("#support_charge").val("");
		$("#final_price").val("");
		$("#selectInstalment").val("none");
	});
*/
//sekisuri_150130 월청구금액 버튼 모달   <END

	//sekisuri_150129   <START

	jQuery('#extendAddSupport').keyup(function () {     
	  this.value = this.value.replace(/[^0-9\.]/g,'');
	});

	$("#btnReIncentive").click(function(){
		getAddIncentive = $("#extendAddSupport").val();
		getFinalIncentive = window.localStorage['판매_최종수수료'];
		reFinalIncentive =  Number(getFinalIncentive) - Number(getAddIncentive);
		$("#extendIncentive").val($.number(reFinalIncentive));
	});
	$("#btnCode").click(function(){
		var getModel = $("#selectModel option:selected").val(); // 모델
		//var getTelecom = $("#selectTelecom option:selected").val(); // 통신사 
		var getCharge = $("#selectCharge option:selected").text();// 요금제이름 value에 공백문제땜시 선택된 텍스트로 가져옴  
		var getType = $("#selectType option:selected").val();
		var getMinus = getType + "_" + getCharge;
		var getCode = $("#inputCode").val();// 판매사 코드
		var getIncentive = window.localStorage['판매_수수료'];
		var is_IDcheck = false;
		$.ajax({
			url:"http://rubicone.cafe24.com/phonecooker/q.php?qdata=user",
			dataType: 'jsonp',
			jsonpCallback:'callback',
			success:function(data){
				$.each(data,function(key,val){
					

					if(val.아이디 == getCode)
					{
						
						is_IDcheck = true;
						//return;
						
					}														
					else
					{
						//is_IDcheck = false;
					//	$("#inputColor").addClass("form-group has-error");
						//$("#inputCode").val('');
						//$("#inputCode").attr("placeholder", "판매사코드가 틀립니다.");
						
						//return false;
					}

				});
				if(is_IDcheck == true)
				{
					$.ajax({
						url:"http://rubicone.cafe24.com/phonecooker/q.php?qdata=minus",
						dataType: 'jsonp',
						//jsonpCallback:'mycall',
						success:function(data){
							$.each(data,function(key,val){
								if(val.모델명 == getModel)
								{
									var final_incentive = Number(getIncentive) - Number(val[getMinus]);
									console.log("sale.js::43 getIncentive : " + getIncentive);
									console.log("sale.js::44 val[getMinus] : " + val[getMinus]);
									console.log("sale.js::45 final_incentive : " + final_incentive);
									$("#extendIncentive").val($.number(final_incentive));
									window.localStorage['판매_최종수수료'] = final_incentive;

								}
							//	console.log("sale.js::49 getMinus : " +getMinus);
							});
							$('#showExtendIncentive').show();

						}
					});
				}
				else
				{
					alert("판매사코드가 틀립니다.");
				}
			}
		});
	});
	//sekisuri_150129   <END

	//sekisuri_   <START
		$("#btnExitExtend").click(function(){
			$('#showExtendIncentive').hide();

		});
	//sekisuri_   <END

});

$(document).ready(function(){
	
	/* 통신사 선택 클릭시 */
	$("#telecom_click").change(function(){
		var item_type = [];
		var getTelecom = $("#selectTelecom option:selected").val();
		item_type.push("<option value='none'>미선택</option>");
		item_type.push("<option value=신규>신규</option>");
		item_type.push("<option value=MNP>번호이동</option>");
		item_type.push("<option value=기변>기기변경</option>");

		$("#selectType").html(item_type.join(""));
		$("#selectModel").val("none");
		$("#selectCharge").val("none");

		/* 가격 리셋 */
		$("#origin_price").val("");
		$("#support_charge").val("");
		$("#final_price").val("");
	});
	/* 통신사 선택 끝 */

	/* 유형 선택시 */
	$("#type_click").change(function(){

		var items = [];
		var tmp_price = [];  //sekisuri 20150115 sk 출고가격

		var getTelecom = $("#selectTelecom option:selected").val();
		$.ajax({
			url: "http://rubicone.cafe24.com/phonecooker/q.php?qdata=model",
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(data){					
				items.push("<option value='none'>미선택 </option>");
				$.each(data,function(key,val){
					
					if(val[getTelecom] != 0)
					{
						items.push("<option value=" + val.모델명 + ">" + val.펫네임 + "</option>");
						tmp_price.push("<input type=hidden id=" +  val.모델명 + " value=" + val[getTelecom] + ">");
						//sk 출고가격도 히든으로 해놓음 이케 안하면 난주 또 불러와야됨
					}
				});
				$("#selectModel").html(items.join(""));
				/* sekisuri 20150115 sk 출고가격도 히든으로 */
				$("#tmp_price").html(tmp_price.join(""));
				/* 상위선택시 하위 셀렉트 미선택으로 */
				$("#selectCharge").val("none");
			},
			error: function(xhr){
				console.log('json Error',xhr);
			}
		});
	});
	/* 유형 선택 끝 */

	/* 핸드폰 기기선택 클릭 */ 
	$("#model_click").change(function(){
		var items = [];
		var getTelecom = $("#selectTelecom option:selected").val();
		$("#saleFail").hide();

		$.ajax({
			url: "http://rubicone.cafe24.com/phonecooker/q.php?qdata=charge",
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(data){
				items.push("<option value='none'>미선택 </option>");
				$.each(data,function(key,val){
					if(val.통신사 == getTelecom)
					{
						items.push("<option value=" + getTelecom + ">" + val.요금제명 + "</option>");
					}	
				});
				$("#selectCharge").html(items.join(""));
				/* sekisuri 2015/01/13 사진밑에 모델명 찍어줌 (후에 사진도 바꿔야 됨) */
				var getModel = $("#selectModel option:selected").val(); 
				$("#phone_modelcode").html(getModel);	
				/* sekisuri 2015/01/13 사진밑에 모델명 찍어줌 끝 -------->*/

				/* 출고가 출력 및 공시지원 할부원금 리셋*/
				var getModel = $("#selectModel option:selected").val();
				var getOriginPrice = $('#' + getModel).val(); //<input type=hidden 으로 가져왔던 출고가
				$("#origin_price").val($.number(getOriginPrice));
				$("#support_charge").val("");
				$("#final_price").val("");
				/* 출고가 출력 및 공시지원 할부원금 리셋 끝 ------>*/

			},
			error: function(xhr){
				console.log('json Error',xhr);
			}

		});		

		/* incentive json을 가져와 판매수익 저장하고 판매불가시 메시지 표시함 */	
		var getType = $("#selectType option:selected").val();
		var getModel = $("#selectModel option:selected").val();
		var getIncenType = getTelecom + "_" + getType; // sekisuri incentive.json:: 'SK + _ + 신규' SK예)SK_신규

		console.log("sale.js::154 getType = " + getType);
		console.log("sale.js::155 getIncenType = " + getIncenType);
		$.ajax({
			url: "http://rubicone.cafe24.com/phonecooker/q.php?qdata=incentive",
			dataType: 'jsonp',
			jsonpCallback: 'mycall',
			success: function(data){
				$.each(data,function(key,val){
					if(val.모델명 == getModel)
					{
						console.log("sale.js::164 val.모델명 = " + val.모델명);
						console.log("sale.js::165 getIncenType = " +getIncenType);
						if(val[getIncenType] == "판매불가")
						{
							//$("#saleFail").show();
							//sekisuri_15130 판매불가 선택시 모델 출고가 초기화   <START
							alert("판매불가");
							$("#selectModel").val("none");
							$("#origin_price").val("");
							//sekisuri_150130 판매불가 선택시 모델 출고가 초기화   <END

						}
						else
						{
							window.localStorage['판매_수수료'] = val[getIncenType];
							console.log("sale.js::173 판매수수료 = " + val[getIncenType]);
						}
					}
				});
			},
			error: function(xhr){
				console.log('json Error',xhr);
			}


		});
		/* incentive json을 가져와 판매수익 저장하고 판매불가시 메시지 표시함 -끝- */		
	});
	/* 핸드폰 선택 끝 */

	/* 요금제 선택 */
	$("#charge_click").change(function(){

		$("#loading").fadeIn(500);
		var getTelecom = $("#selectTelecom option:selected").val();
	//	var getType = $("#selectType option:selected").val();
		var getModel = $("#selectModel option:selected").val();
		var getCharge = $("#selectCharge option:selected").text();// 요금제 value에 공백문제땜시 선택된 텍스트로 가져옴  
		var getOriginPrice = $('#' + getModel).val(); //<input type=hidden 으로 가져왔던 출고가

		$.ajax({
			url: "http://rubicone.cafe24.com/phonecooker/q.php?qdata=support",
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(data){					
				$.each(data,function(key,val){
		//		console.log("OUT: " +val.MODELCODE + " getModel : " + getModel);
				if(val.모델명 == getModel)
				{
					console.log(val.모델명);
					console.log(getModel);
					var supportPrice = val[getCharge];
					var totalPrice = getOriginPrice - val[getCharge];

					$("#origin_price").val($.number(getOriginPrice));
					$("#support_charge").val($.number(supportPrice));
					$("#final_price").val($.number(totalPrice));

				}
			});
			},
			error: function(xhr){
				console.log('json Error',xhr);
			}
		});

		$("#loading").fadeOut(500);
	});
	/* 요금제 선택 끝 */

	/* 모달 (통신요금 및 핣부원금 상세) */
	$("#btnModal").click(function(){
		var getModel = $("#selectModel option:selected").val(); // 모델
		var getModelText = $("#selectModel option:selected").text(); // 모델 펫네임

		var getTelecom = $("#selectTelecom option:selected").val(); // 통신사 
		var getType = $("#selectType option:selected").val();

		var getOriginPrice = $("#origin_price").val(); // 출고가 
		var getSupport = $("#support_charge").val(); // 지원금
		var getFinal = $("#final_price").val().replace(",",""); // 할부원금 --콤마 제거
		var getSelectInstalment = $("#selectInstalment option:selected").val(); // 할부개월
		var monthModelPrice = getFinal / getSelectInstalment; // 월 기기 요금 
		
		
		var getTelecomPrice = '';// 통신요금 
		var getTelecomTex = '';// 부가세
		var monthTelecomPrice = '';// 월 통신요금
		var getDiscount = ''; // 할인 -- 넣을지 말지 모르것다.
		
		var getCharge = $("#selectCharge option:selected").text();// 요금제이름 value에 공백문제땜시 선택된 텍스트로 가져옴  
		
		$.ajax({
			url: "http://rubicone.cafe24.com/phonecooker/q.php?qdata=charge",
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(data){
				
				$.each(data,function(key,val){
					if(val.요금제명 == getCharge)
					{
						getTelecomPrice = val.기본요금;
						getDiscount = val.월할인금;
					}	
				});
				console.log(getDiscount);
				getDiscount = Number(getDiscount) + (Number(getDiscount) / 10); //  요금할인 부가서 더해줌
				console.log(getDiscount);
				getTelecomTex = Number(getTelecomPrice) / 10;
				monthTelecomPrice = Number(getTelecomPrice) + Number(getTelecomTex) - Number(getDiscount);
				

				window.localStorage['판매_월통신기본요금'] =getTelecomPrice;
				window.localStorage['판매_통신할인금액'] = getDiscount;
				window.localStorage['판매_통신부가세'] = getTelecomTex;
				window.localStorage['판매_월최종통신요금'] = monthTelecomPrice;


				getTelecomPrice = window.localStorage['판매_월통신기본요금'];// 통신요금 
				getTelecomTex = window.localStorage['판매_통신부가세'];// 부가세
				
				getDiscount = window.localStorage['판매_통신할인금액']; // 할인 -- 넣을지 말지 모르것다.
				monthTelecomPrice = window.localStorage['판매_월최종통신요금'];// 월 통신요금
				console.log("월요금 : " +monthTelecomPrice);

				var totalMonthPrice = Number(monthModelPrice) + Number(monthTelecomPrice) ; // 최종 월 납부금액-- 

				$("#price_header").html("요금: " + getCharge + " 모델: " + getModelText); //요금명, 모델명
				$("#modalType").html(getType); // 유형
				$("#modalOriginPrice").html(getOriginPrice + "원"); // 출고가, 어차피 계산할필요 없어서 콤마찍힌거 가져옴 
				$("#modalSupport").html($.number(getSupport) + "원"); // 지원금
				$("#modalFinalPrice").html($.number(getFinal) + "원");	 // 할부원금
				$("#modalMonth").html(getSelectInstalment + "개월");	// 할부개월
				$("#modalMonthModel").html($.number(monthModelPrice) + "원  <p>(할부수수료 미포함)</p>"); // 월 기기 요금
				$("#modalMonthTelecom").html($.number(getTelecomPrice) + "원"); // 통신요금  -- 아직 통신요금 모름
				//
				$("#modalTelecomTex").html($.number(getTelecomTex) + "원");		//통신요금 부가세 -- 아직모름
				//$("#modalTotalTelecom").html($.number(monthTelecomPrice) + "원")	//월 요금
				$("#modalDiscount").html("-" + $.number(getDiscount) + "원  <p>(요금할인 부가세 포함)</p>"); // 할인 -- 요건 넣을지 말지 아직모름
				$("#modalTotalMonthPrice").html("<strong>" + $.number(totalMonthPrice) + "원 </strong>");	
				// 월 납부금 --통신요금을 몰라서 우선 월 기기요금으로...

				//getIncentive = window.localStorage['판매_수수료'];
				//$("#modalIncentive").val($.number(getIncentive) + "원");

				//sekisuri_150130  수수료 모드 <START
				$("#extendTelecom").val(getTelecom); //통신사
				$("#extendOrigin").val(getOriginPrice); //출고가격
				$("#extendType").val(getType); //유형
				$("#extendSupport").val(getSupport); // 공시 지원금
				$("#extendModel").val(getModel); // 모델
				// 추가 지원금
				$("#extendTelecomPrice").val($.number(getTelecomPrice)); //요금제
				$("#extendFinal").val($.number(getFinal)); // 할부원금
				//sekisuri_150130 수수료 모드   <END
				setLocalStorage(); // 로컬스토리지에 저장

			},
			error: function(xhr){
				console.log('json Error',xhr);
			}

		});		

	});	
	/* 모달 (통신요금 및 핣부원금 상세)  끝*/
	/* 모달 코드 입력시 수수료 보여줌 */
	$("#btnIncentiveCode").click(function(){
			var getCode = $("#modalIncentive").val();
			var getIncentive = window.localStorage['판매_수수료'];
			$.ajax({
				url:"http://rubicone.cafe24.com/phonecooker/q.php?qdata=user",
				dataType: 'jsonp',
				jsonpCallback:'callback',
				success:function(data){
					$.each(data,function(key,val){
						
						if(val.아이디 == getCode)
						{
							//console.log("성공 " + val.아이디);
						//	$("#inputColor").removeClass('form-group has-error');
							$("#modalIncentive").attr("disabled","disabled");
							$("#modalIncentive").val($.number(getIncentive) + "원");
						}														
						else
						{
						//	$("#inputColor").addClass("form-group has-error");
							$("#modalIncentive").val('');
							$("#modalIncentive").attr("placeholder", "판매사코드가 틀립니다.");
						}
					});
				}
			});
		});
	/* 모달 코드 입력시 수수료 보여줌 */



});
/* 로컬스토로지에 저장 */                
function setLocalStorage(){
	var setHeader = $("#price_header").html(); // 요금명,모델명
	var setType = $("#modalType").html(); // 유형
	var setOriginPrice = $("#modalOriginPrice").html(); // 출고가
	var setSupport = $("#modalSupport").html(); // 지원금
	var setFinalPrice = $("#modalFinalPrice").html(); // 할부원금
	var setMonth = $("#modalMonth").html(); // 할부개월
	var setMonthModel = $("#modalMonthModel").html(); // 월기기요금
	var setMonthTelcom = $("#modalMonthTelecom").html(); //통신요금
	var setTelecomTex = $("#modalTelecomTex").html();//부가세
	var setTotalTelecom = $("#modalTotalTelecom").html();//월통신요금
	var setTotalMonthPrice = $("#modalTotalMonthPrice").html();// 월납부금
	console.log(setHeader);

	window.localStorage['판매_요금명'] =setHeader;// setHeader.value;
	window.localStorage['판매_유형'] = setType;
	window.localStorage['판매_출고가'] = setOriginPrice;
	window.localStorage['판매_지원금'] = setSupport;
	window.localStorage['판매_할부원금'] = setFinalPrice;
	window.localStorage['판매_할부개월'] = setMonth;
	window.localStorage['판매_월기기요금'] = setMonthModel;
	window.localStorage['판매_월통신기본요금'] = setMonthTelcom;
	window.localStorage['판매_통신부가세'] = setTelecomTex;
	window.localStorage['판매_월최종통신요금'] = setTotalTelecom;
	window.localStorage['판매_월납부금'] = setTotalMonthPrice;

}      
/* 로컬스토리지에 저장 */
