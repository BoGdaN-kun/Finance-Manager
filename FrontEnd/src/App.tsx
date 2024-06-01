import React from 'react';
import './App.css';
import Home from "./Components/User/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Create from "./Components/User/Create";
import UserDetails from "./Components/User/UserDetails";
import Edit from "./Components/User/Edit";
import TransactionsHome from "./Components/Tranasction/TransactionsHome";
import TransactionEdit from "./Components/Tranasction/TransactionEdit";
import TranasctionDetails from "./Components/Tranasction/TranasctionDetails";
import TransactionCreate from "./Components/Tranasction/TrensactionCreate";
import LoginComponent from "./Components/Login/Login";
import RegisterComponent from "./Components/Login/RegisterComponent";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>

                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/create" element={<Create/>}></Route>
                    <Route path="/edit/:id" element={<Edit/>}></Route>
                    <Route path="/users/:id" element={<UserDetails/>}></Route>
                    <Route path="/transactions" element={<TransactionsHome/>}></Route>
                    <Route path="/transactions/edit/:id" element={<TransactionEdit/>}></Route>
                    <Route path="/transactions/details/:id" element={<TranasctionDetails/>}></Route>
                    <Route path="/transactions/create" element={<TransactionCreate/>}></Route>
                    <Route path="/login" element={<LoginComponent/>}></Route>
                    <Route path="/register" element={<RegisterComponent/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
