'use strict'

var partsBtnResourceNameList = [ "a_c", "a_t", "a_p", "a_hair", "a_face", "a_c", "a_g", "a_eyebrow", "a_eye", "a_mouse" ];
var testAvatarData = function( in_iconNM, in_id, in_gender, in_cate, in_name, in_itemID, in_buyPrice, in_sellPrice )
{
    this.ICONNM = in_iconNM;
    this.ID = in_id;
    this.GENDER = in_gender;
    this.CATE = in_cate;
    this.NM = in_name;
    this.ITEM_ID = in_itemID;
    this.BUY_PRICE = in_buyPrice;
    this.SELL_PRICE = in_sellPrice;
}

var testAvatarDataList = [];

// boy
testAvatarDataList.push( new testAvatarData( "850000", 1, 1, PARTS_BODY, "girl_body_01", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 1, PARTS_UPPER, "상의 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850000", 1, 1, PARTS_UPPER, "적색아디다스", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850001", 2, 1, PARTS_UPPER, "스마일반팔티", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850002", 3, 1, PARTS_UPPER, "포근포근니트", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850003", 4, 1, PARTS_UPPER, "가로줄아우터", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850004", 5, 1, PARTS_UPPER, "점선격자무늬", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850005", 6, 1, PARTS_UPPER, "경수형의셔츠", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850006", 7, 1, PARTS_UPPER, "슈슈슈퍼맨", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "850007", 8, 1, PARTS_UPPER, "커스텀용상의", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 1, PARTS_LOWER, "하의 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "851000", 1, 1, PARTS_LOWER, "나의복숭아뼈", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "851001", 2, 1, PARTS_LOWER, "동내백수패션", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "851002", 3, 1, PARTS_LOWER, "피로물든바지", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "851003", 4, 1, PARTS_LOWER, "입으면더워요", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "851004", 5, 1, PARTS_LOWER, "바지위에팬티입고", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "cancel", 6, 1, PARTS_LOWER, "커스텀용하의", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 1, PARTS_HAIR, "자라나라머리머리", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "852000", 1, 1, PARTS_HAIR, "이대팔가르마", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "852001", 2, 1, PARTS_HAIR, "만화에서봤어", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "852002", 3, 1, PARTS_HAIR, "탈색한번할까", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "852003", 4, 1, PARTS_HAIR, "강렬한모히칸", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "852004", 5, 1, PARTS_HAIR, "24님머리", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "852005", 6, 1, PARTS_HAIR, "양쪽깻잎머리", 1002, 1000, 8000 ) );

// testAvatarDataList.push( new testAvatarData( "850001", 1, 1, PARTS_HEAD, "girl_head_01", 1002, 1000, 8000 ) ); //
// testAvatarDataList.push( new testAvatarData( "850000", 2, 1, PARTS_HEAD, "girl_head_02", 1002, 1000, 8000 ) ); //

testAvatarDataList.push( new testAvatarData( "cancel", 0, 1, PARTS_HEAD, "할로우맨", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "853000", 1, 1, PARTS_HEAD, "나를건들지마", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "853001", 2, 1, PARTS_HEAD, "왜글케생겼니", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "853002", 3, 1, PARTS_HEAD, "으히히으히히", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "853003", 4, 1, PARTS_HEAD, "기분조금언짢", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "853004", 5, 1, PARTS_HEAD, "얼굴테스트용", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 1, PARTS_CAP, "모자 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "854000", 1, 1, PARTS_CAP, "노란신사해트", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "854001", 2, 1, PARTS_CAP, "스카이블루캡", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "854002", 3, 1, PARTS_CAP, "해골이강하다", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "854003", 4, 1, PARTS_CAP, "써보면마법이", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 1, PARTS_ACC, "안경 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "855000", 1, 1, PARTS_ACC, "제우쓴글라스", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "855001", 2, 1, PARTS_ACC, "공부좀잘할듯", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "855002", 3, 1, PARTS_ACC, "매우난해한경", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "855003", 4, 1, PARTS_ACC, "채찍들것같은", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "855004", 5, 1, PARTS_ACC, "24님안경", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "mouse_01", 0, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_02", 1, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_03", 2, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_04", 3, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_05", 4, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_06", 5, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_07", 6, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "mouse_08", 7, 1, PARTS_MOUSE, "마우쓰", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "eye_01", 0, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_02", 1, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_03", 2, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_04", 3, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_05", 4, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_06", 5, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_07", 6, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eye_08", 7, 1, PARTS_EYE, "더미눈알", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "eyebrow_01", 0, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_02", 1, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_03", 2, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_04", 3, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_05", 4, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_06", 5, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_07", 6, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "eyebrow_08", 7, 1, PARTS_EYEBROW, "더미눈썹", 1002, 1000, 8000 ) );


// girl, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "800000", 1, 2, PARTS_BODY, "girl_body_01", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 2, PARTS_UPPER, "상의 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "800000", 1, 2, PARTS_UPPER, "분홍색상의다", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "800001", 2, 2, PARTS_UPPER, "하늘가로무늬", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "800002", 3, 2, PARTS_UPPER, "쿵푸잘하겠다", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "800003", 4, 2, PARTS_UPPER, "교복상의같아", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "800004", 5, 2, PARTS_UPPER, "핑크빛원피스", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "cancel", 6, 2, PARTS_UPPER, "커스텀용상의", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 2, PARTS_LOWER, "하의 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "801000", 1, 2, PARTS_LOWER, "청청반반바지", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "801001", 2, 2, PARTS_LOWER, "속바지입었다", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "801002", 3, 2, PARTS_LOWER, "이왕다홍치마", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "801003", 4, 2, PARTS_LOWER, "교복치마일걸", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "801004", 5, 2, PARTS_LOWER, "속옷과바지사이", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "cancel", 6, 2, PARTS_LOWER, "커스텀용하의", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 2, PARTS_HAIR, "자라나라머리머리", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "802000", 1, 2, PARTS_HAIR, "초록브로콜리", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "802001", 2, 2, PARTS_HAIR, "내가바로악마", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "802002", 3, 2, PARTS_HAIR, "머리볼에닿아", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "802003", 4, 2, PARTS_HAIR, "양쪽꽁지머리", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "802004", 5, 2, PARTS_HAIR, "왼쪽가르마단발", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "802005", 6, 2, PARTS_HAIR, "중국춘리머리", 1002, 1000, 8000 ) );

// testAvatarDataList.push( new testAvatarData( "800001", 1, 2, PARTS_HEAD, "girl_head_01", 1002, 1000, 8000 ) ); //
// testAvatarDataList.push( new testAvatarData( "800000", 2, 2, PARTS_HEAD, "girl_head_02", 1002, 1000, 8000 ) ); //

testAvatarDataList.push( new testAvatarData( "cancel", 0, 2, PARTS_EYEBROW, "할로우맨", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "803000", 1, 2, PARTS_EYEBROW, "화장발잘받음", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "803001", 2, 2, PARTS_EYEBROW, "초롱초롱하다", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "803002", 3, 2, PARTS_EYEBROW, "주황무서운눈", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "803003", 4, 2, PARTS_EYEBROW, "기분뭔가언짢", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "803004", 5, 2, PARTS_EYEBROW, "얼굴테스트용", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 2, PARTS_CAP, "모자 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "804000", 1, 2, PARTS_CAP, "써보면마법이", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "804001", 2, 2, PARTS_CAP, "해골이강하다", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "804002", 3, 2, PARTS_CAP, "스카이블루캡", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "804003", 4, 2, PARTS_CAP, "노란여자해트", 1002, 1000, 8000 ) );

testAvatarDataList.push( new testAvatarData( "cancel", 0, 2, PARTS_ACC, "안경 벗기", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "805000", 1, 2, PARTS_ACC, "채찍들것같은", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "805001", 2, 2, PARTS_ACC, "공부좀잘할듯", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "805002", 3, 2, PARTS_ACC, "나는뿔테에요", 1002, 1000, 8000 ) );
testAvatarDataList.push( new testAvatarData( "805003", 4, 2, PARTS_ACC, "강한선글라스", 1002, 1000, 8000 ) );

var getAvatarInfoListByParts = function( in_parts )
{
    var resultList = [];

    for ( var i = 0; i < testAvatarDataList.length; ++i )
    {
        if ( testAvatarDataList[i].CATE == in_parts )
            resultList.push( testAvatarDataList[i] );
    }

    return resultList;
}

var AC_UI =
{
    BG          : 0,
    CLOTHTAB    : 1,
    FACETAB     : 2,
    

    SCROLLVIEW    : 3,
    SCROLLBAR     : 4,

    PARTSBTN    : 5,

    SHOWPARTS_CLOTH : 6,
    SHOWPARTS_FACE  : 7,

    RESET       : 8,
    APPLY       : 9,

    CLOSE       : 10,
}

var FAvatarCustomUI = (function()
{
    function FAvatarCustomUI()
    {
        this.ui = 
        {
            wrapper : null,

            uiList : [],
        }

        this.currentSelectParts = null;        
        
        this.eachPartsSelectInfo = []; // has each parts select id
        this.defaultPartsSelectInfo = [];
        this.defaultGender = null;

        this.lastSelectedUI = null;

        this.notifyCallback = 
        {
            onTabChange : null,
            onPartsCategoryChange : null,
            onPartsChange : null,
            onApply : null,
            onReset : null,
            onClose : null,
        }

        this.isCloseAfterApply = false;

        this.init();
    }

    FAvatarCustomUI.prototype.init = function()
    {        
        G.runnableMgr.add( this );

        this.initUI();
        this.initPartsDefaultForTest();
    }

    FAvatarCustomUI.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = GUI.createContainer();
        this.ui.wrapper.verticalAlignment = GUI.ALIGN_BOTTOM;
        this.ui.wrapper.isPointerBlocker = true;
        this.ui.wrapper.height = px( 550 );

        this.ui.uiList[AC_UI.BG] = GUI.CreateImage( "ShopBG", px(0), px(0), 1, px(314), AVATAR_PATH+"a_f5.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.uiList[AC_UI.BG] );
        
        var myAvatarTabBtn = GUI.CreateButton( "avatarInvenTabBtn", px(10), px(-310), px(138), px(74), AVATAR_PATH+"a_t.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.uiList[AC_UI.CLOTHTAB] = myAvatarTabBtn;
        this.ui.wrapper.addControl( myAvatarTabBtn );
        myAvatarTabBtn.onPointerUpObservable.add( function()
        {
            self.onClickMyAvatarTab();
        });
        
        var myFaceTabBtn = GUI.CreateButton( "myFaceTabBtn", px(150), px(-310), px(138), px(74), AVATAR_PATH+"a_t2-1.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.uiList[AC_UI.FACETAB] = myFaceTabBtn;
        this.ui.wrapper.addControl( myFaceTabBtn );
        myFaceTabBtn.onPointerUpObservable.add( function()
        {
            self.onClickMyFaceTab();
        });
        

        this.ui.uiList[AC_UI.SCROLLVIEW] = new GUI.createScrollView( this.ui.wrapper, "avatarListView", px(0), px(25), px(720), px(260), 1.1, false, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.uiList[AC_UI.SCROLLBAR] = new GUI.createScrollBar( this.ui.uiList[AC_UI.SCROLLVIEW], "avatarListBar", SHOPUI_PATH+"s_bar.png", SHOPUI_PATH+"empty.png",  
            px(0), px(-5), px(710), px(15), px(77), px(15), GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.uiList[AC_UI.SCROLLVIEW].linkScrollBar( this.ui.uiList[AC_UI.SCROLLBAR] );


        var createPartsBtn = function( in_posOrder, in_partOrder, in_showTab )
        {
            var btn = GUI.CreateButton( "avatarInvenTabBtn", px(20 + (65*in_posOrder*1.4)), px(-246), px(62), px(62), 
                AVATAR_PATH+partsBtnResourceNameList[in_partOrder]+"1.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
            self.ui.wrapper.addControl( btn );
            btn.onPointerUpObservable.add(function()
            {
                self.onClickPartsBtn( in_partOrder );
            });

            self.ui.uiList[AC_UI.PARTSBTN][in_partOrder] = btn;
            self.ui.uiList[in_showTab].push( btn );
        }
        
        this.ui.uiList[AC_UI.PARTSBTN] = [];
        this.ui.uiList[AC_UI.SHOWPARTS_CLOTH] = [];
        this.ui.uiList[AC_UI.SHOWPARTS_FACE] = [];

        // var posOrder = 0;
        // for ( var i = PARTS_UPPER; i <= PARTS_EYEBROW; ++i )
        // {
        //     if ( getAvatarInfoListByParts(i).length > 0 )
        //         createPartsBtn( posOrder++, i );
        // }

        // cloth parts
        if ( getAvatarInfoListByParts( PARTS_UPPER ).length > 0 )   createPartsBtn( 0, PARTS_UPPER, AC_UI.SHOWPARTS_CLOTH );
        if ( getAvatarInfoListByParts( PARTS_LOWER ).length > 0 )   createPartsBtn( 1, PARTS_LOWER, AC_UI.SHOWPARTS_CLOTH );
        if ( getAvatarInfoListByParts( PARTS_CAP ).length > 0 )     createPartsBtn( 2, PARTS_CAP, AC_UI.SHOWPARTS_CLOTH );
        if ( getAvatarInfoListByParts( PARTS_ACC ).length > 0 )     createPartsBtn( 3, PARTS_ACC, AC_UI.SHOWPARTS_CLOTH );

        // face parts
        if ( getAvatarInfoListByParts( PARTS_HEAD ).length > 0 )    createPartsBtn( 0, PARTS_HEAD, AC_UI.SHOWPARTS_FACE );
        if ( getAvatarInfoListByParts( PARTS_HAIR ).length > 0 )    createPartsBtn( 1, PARTS_HAIR, AC_UI.SHOWPARTS_FACE );
        if ( getAvatarInfoListByParts( PARTS_EYEBROW ).length > 0 ) createPartsBtn( 2, PARTS_EYEBROW, AC_UI.SHOWPARTS_FACE );
        if ( getAvatarInfoListByParts( PARTS_EYE ).length > 0 )   createPartsBtn( 3, PARTS_EYE, AC_UI.SHOWPARTS_FACE );
        if ( getAvatarInfoListByParts( PARTS_MOUSE ).length > 0 )   createPartsBtn( 4, PARTS_MOUSE, AC_UI.SHOWPARTS_FACE );

        this.showPartsType( AC_UI.SHOWPARTS_CLOTH );

        var resetBtn = GUI.CreateButton( "resetBtn", px(5), px(-400), px(121), px(118), AVATAR_PATH+"a_reset_btn.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.uiList[AC_UI.RESET] = resetBtn;
        this.ui.wrapper.addControl( resetBtn );
        resetBtn.onPointerUpObservable.add( function()
        {
            self.onClickresetBtn();
        });

        var applyBtn = GUI.CreateButton( "applyBtn", px(-5), px(-400), px(121), px(118), AVATAR_PATH+"a_save_btn.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM );
        this.ui.uiList[STARCON_SELECT_UI.APPLY] = applyBtn;
        this.ui.wrapper.addControl( applyBtn );
        applyBtn.onPointerUpObservable.add( function()
        {
            self.onClickApplyBtn();
        });

        var closeBtn = GUI.CreateButton( "closeBtn", px(7), px(25), px(128), px(85), AVATAR_PATH+"a_x.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.uiList[AC_UI.CLOSE] = closeBtn;
        closeBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });
    }

    FAvatarCustomUI.prototype.showPartsType = function( in_showPartsType )
    {
        for ( var i = 0; i < this.ui.uiList[AC_UI.PARTSBTN].length; ++i )
        {
            if ( this.ui.uiList[AC_UI.PARTSBTN][i] != undefined )
                this.ui.uiList[AC_UI.PARTSBTN][i].isVisible = false;
        }

        var showParts = this.ui.uiList[ in_showPartsType ];

        for( var i = 0; i < showParts.length; ++i )
        {
            var partsBtn = showParts[i];
            partsBtn.isVisible = true;
        }
    }

    FAvatarCustomUI.prototype.openUI = function( in_isCloseAfterApply )
    {
        this.isCloseAfterApply = in_isCloseAfterApply;

        G.guiMain.addControl( this.ui.wrapper );

        if ( !in_isCloseAfterApply )
            G.guiMain.addControl( this.ui.uiList[AC_UI.CLOSE] );

        this.onClickPartsBtn( PARTS_UPPER );
    }

    FAvatarCustomUI.prototype.closeUI = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );
        G.guiMain.removeControl( this.ui.uiList[AC_UI.CLOSE] );
    }

    FAvatarCustomUI.prototype.refreshPartsList = function()
    {
        this.ui.uiList[AC_UI.SCROLLVIEW].clearItem();
        this.lastSelectedUI = null;

        var dataList = getAvatarInfoListByParts( this.currentSelectParts );

        for ( var i = 0; i < dataList.length; ++i )
        {
            if ( dataList[i].GENDER != this.defaultGender )
                continue;
                
            this.ui.uiList[AC_UI.SCROLLVIEW].addItem( this.createPartsListItem( dataList[i] ) );
        }
    }

    FAvatarCustomUI.prototype.createPartsListItem = function( in_avatarPartsData )
    {
        var self = this;

        var button = GUI.CreateButton( "invenTabBtn", px(0), px(0), px(164), px(188), AVATAR_PATH+"a_empty_icon.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var icon = GUI.CreateImage( "shopListItemIcon", px(0), px(-30), px(145), px(130), AVATAR_PATH + "icon/" + in_avatarPartsData.ICONNM +".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        button.addControl( icon );

        var text = GUI.CreateText( px(0), px(-12), in_avatarPartsData.NM, "Black", 23, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        button.addControl( text );

        var priceSymbol = GUI.getSymbolImage( in_avatarPartsData.ITEM_ID, px(26), px(26), px(8), px(-49), GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        button.addControl( priceSymbol );

        var priceText = GUI.CreateText( px(40), px(-50), in_avatarPartsData.SELL_PRICE.toString(), "Gray", 20, GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        button.addControl( priceText );

        var selectCover = GUI.CreateImage( "selectCover", px(2), px(0), px(164*1.1), px(188*1.1), AVATAR_PATH+"selectCover.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        button.addControl( selectCover );
        selectCover.isVisible = false;

        if ( in_avatarPartsData.ID == this.getPartsSelectInfo( in_avatarPartsData.CATE ) )
        {
            this.lastSelectedUI = button;
            selectCover.isVisible = true;
        }

        button.onPointerUpObservable.add( function()
        {
            if ( self.ui.uiList[AC_UI.SCROLLVIEW].blockTouchForScrolling )
                return;

            // if ( in_avatarPartsData.ID > 2 )
            //     return;

            self.onSelectListItem( button, in_avatarPartsData );
        });

        return button;
    }

    FAvatarCustomUI.prototype.onSelectListItem = function( in_selectUI, in_avatarPartsData )
    {
        if ( this.lastSelectedUI != null )
            this.lastSelectedUI.getChildByName("selectCover").isVisible = false;

        in_selectUI.getChildByName("selectCover").isVisible = true;
        this.lastSelectedUI = in_selectUI;

        console.log("아바타 찍었대!!" + JSON.stringify(in_avatarPartsData));

        if ( this.notifyCallback.onPartsChange != null )
            this.notifyCallback.onPartsChange( in_avatarPartsData.CATE, in_avatarPartsData.ID, in_avatarPartsData.ICONNM );

        this.savePartsSelectInfo( in_avatarPartsData.CATE, in_avatarPartsData.ID );
    }

    FAvatarCustomUI.prototype.onClickPartsBtn = function( in_selectParts )
    {
        if ( this.currentSelectParts != null )
            GUI.changeButtonImage( this.ui.uiList[AC_UI.PARTSBTN][this.currentSelectParts], AVATAR_PATH+partsBtnResourceNameList[this.currentSelectParts]+"1.png" );

        this.currentSelectParts = in_selectParts;
        
        GUI.changeButtonImage( this.ui.uiList[AC_UI.PARTSBTN][this.currentSelectParts], AVATAR_PATH+partsBtnResourceNameList[this.currentSelectParts]+"0.png" );

        if ( this.notifyCallback.onPartsCategoryChange != null )
            this.notifyCallback.onPartsCategoryChange( this.currentSelectParts );

        this.refreshPartsList();
    }

    FAvatarCustomUI.prototype.onClickresetBtn = function()
    {
        this.clearEachPartSelectInfo();

        this.refreshPartsList( this.currentSelectParts );
        
        if ( this.notifyCallback.onReset != null )
            this.notifyCallback.onReset();

       
        for ( var i = PARTS_UPPER; i <= PARTS_CAP; ++i )
        {
            if ( this.notifyCallback.onPartsChange != null )
                this.notifyCallback.onPartsChange( i, this.getPartsSelectInfo( i ) );
        }
    }

    FAvatarCustomUI.prototype.onClickApplyBtn = function()
    {
        var selectInfo =  { 
                    'upper'  : this.getPartsSelectInfo( PARTS_UPPER ),
                    'lower'  : this.getPartsSelectInfo( PARTS_LOWER ),
                    'hair'   : this.getPartsSelectInfo( PARTS_HAIR ),
                    'head'   : this.getPartsSelectInfo( PARTS_HEAD ),
                    'eyebrow': this.getPartsSelectInfo( PARTS_EYEBROW ),
                    'cap'    : this.getPartsSelectInfo( PARTS_CAP ),
                    'acc'    : this.getPartsSelectInfo( PARTS_ACC ),
                    'eyebrow': 1,//this.getPartsSelectInfo( PARTS_EYEBROW ),
                    'eye'    : 1,//this.getPartsSelectInfo( PARTS_EYE ),
                    'mouse'  : 1,//this.getPartsSelectInfo( PARTS_MOUSE )
        };

        if ( this.notifyCallback.onApply != null )
            this.notifyCallback.onApply( selectInfo );

        if ( this.isCloseAfterApply )
            this.closeUI();
    }

    FAvatarCustomUI.prototype.onClickCloseBtn = function()
    {
        this.closeUI();

        if ( this.notifyCallback.onClose != null )
            this.notifyCallback.onClose();
    }

    /**
     * @description openUI 함수 부르기 전에 호출해주세요
     * @param {Function( Number, Number)} in_changePartsCallback 파츠별로 아이템을 바꿔 클릭했을때 호출되는 함수입니다. 첫번째 인자 : 파츠 넘버, 두번째 인자 : 선택한 아바타 아이템 인덱스
     * @param {*} in_applyCallback 확정 버튼을 눌럿을때 호출되는 함수입니다. 서버에 동기화 진행하면 됨.
     * @param {*} in_resetCallback 리셋 버튼을 눌렀을떄 호출되는 함수입니다. 근데 아마 안쓰고 in_changePartsCallback 이 초기값으로 파츠마다 들어올 것 같음.
     */
    FAvatarCustomUI.prototype.setNotifyCallback = function( in_tabChangeCallback, in_partsCategoryChange, in_changePartsCallback, in_applyCallback, in_resetCallback, in_onCloseCallback )
    {
        this.clearNotifyCallback();

        this.notifyCallback.onTabChange = in_tabChangeCallback;
        this.notifyCallback.onPartsCategoryChange = in_partsCategoryChange;
        this.notifyCallback.onPartsChange = in_changePartsCallback;
        this.notifyCallback.onApply = in_applyCallback;
        this.notifyCallback.onReset = in_resetCallback;
        this.notifyCallback.onClose = in_onCloseCallback;
    }

    FAvatarCustomUI.prototype.clearNotifyCallback = function()
    {
        this.notifyCallback = 
        {
            onPartsChange : null,
            onApply : null,
            onReset : null,
            onClose : null,
        }
    }

    //
    // select info
    //
    FAvatarCustomUI.prototype.initPartsDefaultForTest = function()
    {
        this.defaultPartsSelectInfo[ PARTS_UPPER ] = 1;
        this.defaultPartsSelectInfo[ PARTS_LOWER ] = 1;
        this.defaultPartsSelectInfo[ PARTS_HAIR ] = 1;
        this.defaultPartsSelectInfo[ PARTS_HEAD ] = 1;
        this.defaultPartsSelectInfo[ PARTS_EYEBROW ] = 1;
        this.defaultPartsSelectInfo[ PARTS_ACC ] = 1;
        this.defaultPartsSelectInfo[ PARTS_CAP ] = 1;

        this.clearEachPartSelectInfo();
    }

    FAvatarCustomUI.prototype.clearEachPartSelectInfo = function()
    {
        this.eachPartsSelectInfo[ PARTS_BODY ] = this.defaultPartsSelectInfo[ PARTS_BODY ];
        this.eachPartsSelectInfo[ PARTS_UPPER ] = this.defaultPartsSelectInfo[ PARTS_UPPER ];
        this.eachPartsSelectInfo[ PARTS_LOWER ] = this.defaultPartsSelectInfo[ PARTS_LOWER ];
        this.eachPartsSelectInfo[ PARTS_HAIR ] = this.defaultPartsSelectInfo[ PARTS_HAIR ];
        this.eachPartsSelectInfo[ PARTS_HEAD ] = this.defaultPartsSelectInfo[ PARTS_HEAD ];
        this.eachPartsSelectInfo[ PARTS_EYEBROW ] = this.defaultPartsSelectInfo[ PARTS_EYEBROW ];
        this.eachPartsSelectInfo[ PARTS_ACC ] = this.defaultPartsSelectInfo[ PARTS_ACC ];
        this.eachPartsSelectInfo[ PARTS_CAP ] = this.defaultPartsSelectInfo[ PARTS_CAP ];
    }

    FAvatarCustomUI.prototype.savePartsSelectInfo = function( in_selectParts, in_selectID )
    {
        this.eachPartsSelectInfo[ in_selectParts ] = in_selectID;
    }

    FAvatarCustomUI.prototype.getPartsSelectInfo = function( in_selectParts )
    {
        return this.eachPartsSelectInfo[ in_selectParts ];
    }

    /*
    var info =  { 'gender' : avatarInfo.gender,
                    'upper'  : 1,
                    'lower'  : 1,
                    'hair'   : 1,
                    'head'   : 1,
                    'eyebrow': 1,
                    'cap'    : 1,
                    'acc'    : 1
        };
    */
    FAvatarCustomUI.prototype.setDefaultAvatarInfo = function( in_avatarInfo )
    {
        this.defaultGender = in_avatarInfo.gender;

        this.defaultPartsSelectInfo[ PARTS_BODY ] = 1;
        this.defaultPartsSelectInfo[ PARTS_UPPER ] = in_avatarInfo[ 'upper' ];
        this.defaultPartsSelectInfo[ PARTS_LOWER ] = in_avatarInfo[ 'lower' ];
        this.defaultPartsSelectInfo[ PARTS_HAIR ] = in_avatarInfo[ 'hair' ];
        this.defaultPartsSelectInfo[ PARTS_HEAD ] = in_avatarInfo[ 'head' ];
        this.defaultPartsSelectInfo[ PARTS_EYEBROW ] = in_avatarInfo[ 'eyebrow' ];
        this.defaultPartsSelectInfo[ PARTS_ACC ] = in_avatarInfo[ 'acc' ];
        this.defaultPartsSelectInfo[ PARTS_CAP ] = in_avatarInfo[ 'cap' ];

        this.clearEachPartSelectInfo();
    }

    FAvatarCustomUI.prototype.onClickMyAvatarTab = function()
    {
        if ( this.notifyCallback.onTabChange != null )
            this.notifyCallback.onTabChange( AC_UI.SHOWPARTS_CLOTH );

        GUI.changeButtonImage( this.ui.uiList[AC_UI.CLOTHTAB], AVATAR_PATH+"a_t.png" );
        GUI.changeButtonImage( this.ui.uiList[AC_UI.FACETAB], AVATAR_PATH+"a_t2-1.png" );

        this.showPartsType( AC_UI.SHOWPARTS_CLOTH );

        this.onClickPartsBtn( PARTS_UPPER );
    }

    FAvatarCustomUI.prototype.onClickMyFaceTab = function()
    {
        if ( this.notifyCallback.onTabChange != null )
            this.notifyCallback.onTabChange( AC_UI.SHOWPARTS_FACE );

        GUI.changeButtonImage( this.ui.uiList[AC_UI.CLOTHTAB], AVATAR_PATH+"a_t-1.png" );
        GUI.changeButtonImage( this.ui.uiList[AC_UI.FACETAB], AVATAR_PATH+"a_t2.png" );

        this.showPartsType( AC_UI.SHOWPARTS_FACE );

        this.onClickPartsBtn( PARTS_HEAD );
    }


    //
    // run by runnableManager
    //
    FAvatarCustomUI.prototype.run = function()
    {
        if ( this.ui.uiList[AC_UI.SCROLLVIEW] != null )
            this.ui.uiList[AC_UI.SCROLLVIEW].procLoop();
    }

    
    //
    // singleton pattern
    //
    var instance;
    return {
        getInstance : function()
        {
            if ( null == instance )
            {
                instance = new FAvatarCustomUI();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FAvatarCustomUI;
}());
