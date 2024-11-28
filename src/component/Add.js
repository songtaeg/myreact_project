import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

function Add() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const navigate = useNavigate();
    
    const userId = localStorage.getItem('userId');
    console.log("로그인 후 사용자 ID:", userId); // 확인용 콘솔 로그
    
    useEffect(() => {
        if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    }, [userId, navigate]);

    const Submit = async (e) => {
        e.preventDefault();

        // 금액이 유효한지 확인
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('유효한 금액을 입력해야 합니다.');
            return;
        }

        // 날짜가 비어있는지 확인
        if (!date) {
            alert('날짜를 선택해야 합니다.');
            return;
        }

        // 사용자가 입력한 날짜를 Date 객체로 변환하여 서버에 전달
        const transaction = {
            user_id: userId,
            description,
            amount: parseFloat(amount), // 소수점 지원
            type,
            category,
            date: date, // 과거 날짜를 그대로 전달
        };

        try {
            const res = await axios.post('http://localhost:3100/transaction/insert', transaction);
            if (res.data.success) {
                alert('거래 추가 완료');
                // 상태 초기화
                setDescription('');
                setAmount('');
                setCategory('');
                setDate('');
                navigate('/main');
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.log('거래 추가 오류:', err);
            alert('거래 추가 실패');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
            <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
                거래 추가
            </Typography>
            <form onSubmit={Submit}>
                <TextField
                    label="설명"
                    variant="outlined"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                />
                <TextField
                    label="금액"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                />
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>유형</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="유형"
                    >
                        <MenuItem value="income">수입</MenuItem>
                        <MenuItem value="expense">지출</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="카테고리"
                    variant="outlined"
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                />
                <TextField
                    label="날짜"
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ padding: '10px', fontSize: '16px' }}
                >
                    추가
                </Button>
            </form>
        </Box>
    );
}

export default Add;
