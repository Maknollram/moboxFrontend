import React, { Component } from "react";
import api from '../../services/api';

import logo from "../../assets/moboxLogo.png";
import "./styles.css";

export default class Main extends Component {
    
    state = {
        newBox: ''
    }

    componentDidMount(){
        let modal = document.getElementById('modal')
            
        modal.style.display = "none"
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

    modal = (tipo)  => {
        
        let modal = document.getElementById('modal')
            
        modal.style.display = tipo

    }
    
    render() {
        return (
            <div id="main-container">
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} alt="moboxLogo" onClick={() => this.modal('block')}/>
                    <input value={this.state.newBox} onChange={this.handleInputChange} maxLength="25" placeholder="Digite o nome para a box" />
                    <button type="submit">Criar</button>
                    <label onClick={this.handleBoxes}>Clique aqui para ver as mobox existentes.</label>
                </form>
                <div id="modal" class="modalPrivado modalContainer">
                    <div class="modal-content">
                        <div align="center">
                            <p>
                                <b>Criado por Maknollram</b>
                                <br/>
                                <b>Mak Inc.</b>
                                <br/>
                                <b>2019</b>
                                <br/>
                                <button id="modalButton" onClick={() => this.modal('none')}>Fechar</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}