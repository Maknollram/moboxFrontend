import React, { Component } from "react";
import api from '../../services/api';

import logo from "../../assets/moboxLogo.png";
import "./styles.css";

export default class Main extends Component {
    
    state = {
        newBox: ''
    }

    handleSubmit = async e  => {
        
        e.preventDefault()

        const response = await api.post('/boxes', {
            title: this.state.newBox
        })

        this.props.history.push(`/box/${response.data._id}`)

    }

    handleInputChange = (e) => {
        this.setState({ newBox: e.target.value })
    }

    handleBoxes = async e  => {
        
        this.props.history.push('/list')

    }
    
    render() {
        return (
            <div id="main-container">
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} alt="moboxLogo" onClick={this.handleBoxes}/>
                    <input value={this.state.newBox} onChange={this.handleInputChange} maxLength="25" placeholder="Digite o nome para a box" />
                    <button type="submit">Criar</button>
                    <label onClick={this.handleBoxes}>Clique aqui para ver as mobox existentes.</label>
                </form>
            </div>
        );
    }
}