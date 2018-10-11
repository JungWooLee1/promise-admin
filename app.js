var express = require('express');   
var app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs')
const mysql = require('mysql');

const users = [
  {
    user_id: 'jw910911',
    user_nickname: '이정우',
    user_pwd: 'sj940531!'
  },
  {
    user_id: 'hyc7575',
    user_nickname: '에이치',
    user_pwd: '1q2w3e4r'
  }
]

// id와 password가 일치하는 유저 찾는 함수, 없으면 undefined 반환
const findUser = (user_id, user_pwd) => {
  return users.find( v => (v.user_id === user_id && v.user_pwd === user_pwd) );
}

// 일치하는 유저의 index값(유니크) 반환
const findUserIndex = (user_id, user_pwd) => {
  return users.findIndex( v => (v.user_id === user_id && v.user_pwd === user_pwd) );
}

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/**
 * body parser /  session 미들웨어 설정
 */

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUnintialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

/**
 *  root 로 접근시 Session을 설정한 뒤 login 페이지 rendering
 */

app.get('/', (req, res) => {
  if(typeof(req.session.userid) !== 'undefined')
  {
   res.redirect('/index');
  }
  else {
    res.render('login', {
      login_success: true,
    });
  }
})

/**
 *  public, vendor 폴더에 대한 접근 권한 설정
 */

app.use(express.static('public'));
app.use(express.static('vendor'));

/**
 *  로그인 시 mysql 테이블에 회원정보가 있는지 확인 뒤 로그인
 */

app.post('/login', (req, res) => {

  const connection = mysql.createConnection({
    host:'promise-admin.chtx7mqxptbf.us-east-2.rds.amazonaws.com',
    port:'3306',
    user:'jw910911',
    password:'sj940531!',
    database:'promise_admin'
  });
  connection.connect();

  const id = req.body.id;
  const password = req.body.password;
  const sql  = `select * from admin_users where id='${id}' and password ='${password}'`;
  console.log(sql);

  connection.query(sql, function (error, results, fields) {
    if (error) {
      console.log(error);
      return;
    }
    if(results.length >= 1) {
      console.log('로그인 성공, 관리자 페이지로 이동합니다.');
      // 세션 설정
      req.session.userid = id;
      //페이지 이동
      res.redirect('/index');
    }
    else {
      console.log('로그인이 실패하였습니다. 아이디와 패스워드를 확인해 주세요')
      res.render('login', { login_success:false });
    }
  });
  connection.end();
});


/**
 * 세션 쿠키의 세션에 id가 존재하는지 확인한다.
 * 만약 아이디가 존재한다면 (login 중일때 ) 항상 index 뷰로 이동한다.
 * 만약 아이디가 존재하지 않는다면 login 뷰로 이동한다.
 **/
app.get('/login', (req, res) => {

  console.log('[get /login]');
  console.log(req.session);
  if(typeof(req.session.userid) !== 'undefined')
  {
    console.log('로그인 세션 존재 => index.ejs 출력');
    res.redirect('/index');
  }
  else {
    console.log('로그인 세션 존재하지 않음 => login.ejs 출력');
    res.render('login', { login_success:true });
  }

});

/**
 * index 페이지를 렌더링 합니다.
 */
app.get('/index', (req, res) => {




  if(typeof(req.session.userid) !== 'undefined')
  {
    res.render('index');
  }
  else {
    res.render('login', {
      login_success: true,
    });
  }
})

// logout을 수행하게 되면 session 을 삭제한다.
app.post('/logout',(req, res) => {
  req.session.destroy();  // 세션 삭제
  res.clearCookie('sid'); // 세션 쿠키 삭제
  res.redirect('/login');
})

/**
 * 유저 정보 페이지를 그려줍니다.
 * res.render 로 유저 정보에 대한 데이터를 mysql 에서 가져와 object 형태로 넘겨줍니다.
 */


app.get('/table', (req, res) => {

  // db 연결
  const connection = mysql.createConnection({
    host:'promise-admin.chtx7mqxptbf.us-east-2.rds.amazonaws.com',
    port:'3306',
    user:'jw910911',
    password:'sj940531!',
    database:'promise_admin'
  });
  connection.connect();

  // 쿼리문 전달
  const sql  = `SELECT * FROM users`;
  connection.query(sql, function (error, results, fields) {
    if (error) {
      console.log(error);
      return;
    }
    else {
      if(isOkSession(req.session.userid))
      {
        res.render('table', {users_info: results});
      }
      else {
        res.render('login', {
          login_success: true
        })
      }
    }
  });
  connection.end();
});



/**
 * 팝업 전송 화면을 보여줍니다.
 */

app.get('/push_input', (req, res)=> {
  if(isOkSession(req.session.userid))
  {
    res.render('push_input');
  }
  else {
    res.render('login', {
      login_success: true
    })
  }
});

/**
 * 팝업 등록 화면을 보여줍니다.
 */

app.get('/push_register', (req, res) => {
  if(isOkSession(req.session.userid))
  {
    res.render('push_register');
  }
  else {
    res.render('login', {
      login_success: true
    })
  }
});

// Session 확인 메서드

function isOkSession(sessionId) {
  if(typeof(sessionId) !== 'undefined') {
    return true;
  }
  else {
    return false;
  }
}


app.listen(3000)















