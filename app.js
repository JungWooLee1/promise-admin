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
  secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
  resave: false,
  saveUninitialized: true
}));

/**
 *  root 로 접근시 Session을 설정한 뒤 login 페이지 rendering
 */

app.get('/', (req, res) => {
  const sess = req.session;

  console.log(req.body);

  res.render('login', {
    nickname: sess.user_uid+1 ? users[sess.user_uid]['user_nickname'] : '',
    login_success: true
  });
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

  console.log('로그인 시도');

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

  connection.query(sql, function (err, rows, field) {
    if (err) {
      console.log(err);
      return;
    }
    
    if(rows.length >= 1) {
      console.log('로그인 성공, 관리자 페이지로 이동합니다.');
      //페이지 이동
      res.render('index',{login_success:true});
    }
    else {
      console.log('로그인 실패 ㅠ')
      res.render('login', {login_success:false});
    }
  });
  connection.end();
});


app.get('/login', (req, res) => {
  res.render('login', { login_success:true });
});

app.listen(3000)















