import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Main() {
    const [userName, setUserName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Local Storage에서 사용자 이름 가져오기
        const name = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        if (name) {
            setUserName(name); // 상태 업데이트
            fetchTransactions(userId); // 거래 내역 가져오기
        }
    }, []);

    const fetchTransactions = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3100/transactions/${userId}`);
            setTransactions(response.data.list);
            calculateTotals(response.data.list);
        } catch (error) {
            console.error('거래 내역 조회 오류:', error);
        }
    };

    const calculateTotals = (transactions) => {
        const income = transactions
            .filter(t => t.type === '수입')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const expense = transactions
            .filter(t => t.type === '지출')
            .reduce((acc, curr) => acc + curr.amount, 0);
        
        setTotalIncome(income);
        setTotalExpense(expense);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('token'); // 토큰 제거
        navigate('/login');
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
                            <Button color="inherit" onClick={handleLogout}>로그아웃</Button>
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
            <Button variant="contained" color="primary" onClick={() => navigate('/add-transaction')}>
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
                                primary={`${transaction.explain} - ${transaction.amount} 원`}
                                secondary={`${transaction.type} | ${transaction.category} | ${transaction.date}`}
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
