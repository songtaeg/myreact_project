import React, { useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Join() {
  const idRef =useRef();
  const nameRef =useRef();
  const pwdRef =useRef();
  const pwdCheckRef = useRef();
  const emailRef =useRef();
  const navigate =useNavigate();

  const [idavailable,setIdavailable]=useState(null);

  async function checkId() {
    const id =idRef.current.value;
    if(!id){
        alert("아이디 입력");
        return;
    }
    try {
        const res=await axios.get(`http://localhost:3100/user/checkid?id=${id}`);
        setIdavailable(res.data.available);
        if (!res.data.available) {
            alert("이미 사용 중인 아이디입니다.");
        } else {
            alert("사용 가능한 아이디입니다.");
        }
    } catch (error) {
        console.log("아이디 중복 체크 중 오류 발생",error);
    }
  }

  async function fnJoin() {
    const id = idRef.current.value;
    const name =nameRef.current.value;
    const pwd =pwdRef.current.value;
    const pwdCheck =pwdCheckRef.current.value;
    const email =emailRef.current.value;

    if (!id || !name || !pwd || !pwdCheck || !email) {
        alert("모든 칸 입력.");
        return;
    }

    if(pwd != pwdCheck){
      alert("비밀번호가 다릅니다.");
      return;
    }

    try {
      const res= await axios.post("http://localhost:3100/user/insert", {
        id, name,pwd,email
      }); //{email:email, pwd:pwd}
      
      if(res.data.success){
        navigate("/login");
      }else{
        alert("비밀번호 다시 확인");
      }
    } catch (error) {
      console.log("서버 호출 중 오류 발생");
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: '#e0f7fa', padding: 3 }}
    >
      <Box 
        sx={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '20px',  
          backgroundColor: '#fff', 
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
          borderRadius: '8px'  
        }}
      >
        <Typography variant="h4" mb={3} align="center">
          회원가입
        </Typography>
        <TextField inputRef={idRef} label="아이디" variant="outlined" fullWidth margin="normal" />
        <Button onClick={checkId} variant="outlined" color="secondary" fullWidth margin="normal" >중복 체크</Button>
        <TextField inputRef={nameRef} label="이름" variant="outlined" fullWidth margin="normal" />
        <TextField inputRef={pwdRef} label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" />
        <TextField inputRef={pwdCheckRef} label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" />
        <TextField inputRef={emailRef} label="이메일" variant="outlined" fullWidth margin="normal" />
        <Button onClick={fnJoin} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          회원가입
        </Button>
        <Typography mt={2} align="center">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Join;