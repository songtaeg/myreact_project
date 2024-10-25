import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Main() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('userName');
        const id = localStorage.getItem('userId'); // 'Id'를 'id'로 수정하여 일관성 유지
        if (name && id) {
            setUserName(name);
            setUserId(id); // userId를 설정
            fetchTransactions(id); // userId를 사용하여 거래 내역을 가져옴
        } else {
            navigate('/login'); // 로그인되지 않았을 때 로그인 페이지로 리디렉션
        }
    }, [navigate]);

    const fetchTransactions = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3100/transaction/${userId}`);
            setTransactions(response.data.list);
            calculateTotals(response.data.list);
        } catch (error) {
            console.log('거래 내역 조회 오류:', error);
        }
    };

    const calculateTotals = (transactions) => {
        const income = transactions
            .filter(t => t.type === '수입') // "수입" 거래만 필터링
            .reduce((acc, curr) => acc + curr.amount, 0); //필터링 거래 합산
        const expense = transactions
            .filter(t => t.type === '지출')
            .reduce((acc, curr) => acc + curr.amount, 0);

        setTotalIncome(income);
        setTotalExpense(expense);
    };

    const Logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate =(dateString) =>{
        const date =new Date(dateString).toLocaleString();
        return `${date}`;
    };

    return (
        <Box sx={{ padding: 3 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        가계부
                    </Typography>
                    {userName ? (
                        <>
                            <Typography variant="body1" sx={{ marginRight: 2 }}>
                                {userName}님 환영합니다!
                            </Typography>
                            <Button color="inherit" onClick={Logout}>로그아웃</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>로그인</Button>
                    )}
                </Toolbar>
            </AppBar>

            <Typography variant="h6" gutterBottom>
                총 수입: {totalIncome} 원
            </Typography>
            <Typography variant="h6" gutterBottom>
                총 지출: {totalExpense} 원
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/add')}>
                거래 추가하기
            </Button>
            <Typography variant="h5" sx={{ marginTop: 3 }}>
                최근 거래 내역
            </Typography>
            <List>
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <ListItem key={transaction.id}>
                            <ListItemText
                                primary={`${transaction.description} - ${transaction.amount} 원`}
                                secondary={`${transaction.type} | ${transaction.category} | ${formatDate(transaction.date)}`}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1">거래 내역이 없습니다.</Typography>
                )}
            </List>
        </Box>
    );
}

export default Main;
