import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, AppBar, Toolbar, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Main() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [chartData, setChartData] = useState([]);  
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('userName');
        const id = localStorage.getItem('userId');
        if (name && id) {
            setUserName(name);
            setUserId(id);
            fetchTransactions(id); 
        } else {
            navigate('/login'); 
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
            .filter(t => t.type === '수입') 
            .reduce((acc, curr) => acc + curr.amount, 0); 
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

    //지출 필터링
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

            setChartData(updatedChartData);
        }
    }, [transactions]);

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
                        가계부
                    </Typography>
                    {userName ? (
                        <>
                            <Typography variant="body1" sx={{ color: '#fff', marginRight: 2 }}>
                                {userId}님 환영합니다!
                            </Typography>
                            <Button color="inherit" onClick={Logout}>로그아웃</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>로그인</Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2, marginTop: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    총 수입: {totalIncome} 원
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    총 지출: {totalExpense} 원
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/add')} sx={{ marginBottom: 3 }}>
                    거래 추가하기
                </Button>
            </Box>

            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    최근 거래 내역
                </Typography>
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}>
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
                            <Typography variant="body1" sx={{ color: 'gray' }}>거래 내역이 없습니다.</Typography>
                        )}
                    </List>
                </Paper>
            </Box>

            {chartData.length > 0 && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        지출 카테고리별 금액
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="category" dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#ff8042" barSize={30}/>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
}

export default Main;
