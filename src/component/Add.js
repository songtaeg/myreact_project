import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Add() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');
    const [category, setCategory] = useState('');

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

        const transaction = {
            user_id: userId,
            description,
            amount: parseFloat(amount), // 소수점 지원
            type,
            category,
        };

        try {
            const res = await axios.post('http://localhost:3100/transaction/insert', transaction);
            if (res.data.success) {
                alert('거래 추가 완료');
                // 상태 초기화
                setDescription('');
                setAmount('');
                setCategory('');
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
        <div>
            <h2>거래 추가</h2>
            <form onSubmit={Submit}>
                <div>
                    <label>설명:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>금액:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>유형:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="income">수입</option>
                        <option value="expense">지출</option>
                    </select>
                </div>
                <div>
                    <label>카테고리:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">추가</button>
            </form>
        </div>
    );
}

export default Add;
