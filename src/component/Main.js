import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Main() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [chartData, setChartData] = useState([]);  // chartData 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('userName');
        const id = localStorage.getItem('userId');
        if (name && id) {
            setUserName(name);
            setUserId(id);
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
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    // 지출 카테고리별 금액을 계산한 데이터
    const expenseData = transactions
        .filter(transaction => transaction.type === '지출') // 지출만 필터링
        .reduce((acc, transaction) => {
            // 각 카테고리별로 금액을 합산
            if (acc[transaction.category]) {
                acc[transaction.category] += transaction.amount;
            } else {
                acc[transaction.category] = transaction.amount;
            }
            return acc;
        }, {});

    // 차트 데이터로 변환 (동적으로 데이터 계산) - 여기서 계산된 데이터는 차트에 필요한 형식으로 변환됨
    const updatedChartData = Object.keys(expenseData).map(category => ({
        category,
        amount: expenseData[category]
    }));

    // useEffect 추가: transactions 상태가 변경될 때마다 expenseData와 chartData를 다시 계산하도록 설정
    useEffect(() => {
        if (transactions.length > 0) {
            const expenseData = transactions
                .filter(transaction => transaction.type === '지출')
                .reduce((acc, transaction) => {
                    if (acc[transaction.category]) {
                        acc[transaction.category] += transaction.amount;
                    } else {
                        acc[transaction.category] = transaction.amount;
                    }
                    return acc;
                }, {});

            const updatedChartData = Object.keys(expenseData).map(category => ({
                category,
                amount: expenseData[category]
            }));

            // 상태 업데이트: 새롭게 계산된 차트 데이터를 setChartData로 업데이트
            setChartData(updatedChartData);
        }
    }, [transactions]);  // transactions 상태가 변경될 때마다 실행됨

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
                                {userId}님 환영합니다!
                            </Typography>
                            <Button color="inherit" onClick={Logout}>로그아웃</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>로그인</Button>
                    )}
                </Toolbar>
            </AppBar>

            <Typography variant="h6">
                총 수입: {totalIncome} 원
            </Typography>
            <Typography variant="h6" >
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

            {/* 지출 카테고리별 금액을 가로 막대 그래프로 표시 */}
            {chartData.length > 0 && (
                <Typography variant="h5" sx={{ marginTop: 3 }}>
                    지출 카테고리별 금액
                </Typography>
            )}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#ff8042" barSize={30}/>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default Main;
