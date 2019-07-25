import React, { Component } from "react";
import axios from 'axios';
import api from "../../services/api";
import {MdDelete} from 'react-icons/md';
import {distanceInWords} from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';
import logo from "../../assets/moboxMin.png";
import { Link } from 'react-router-dom';
import "./styles.css";

export default class Box extends Component {

    state = { boxes: {}, show: false, moboxName: '', fileQtt: 0 }

    async componentDidMount(){

        this.subscribeToNewFiles()
        
        const response = await api.get('list')

        this.setState({boxes: response})

    }

    subscribeToNewFiles = () =>{
        
        const io = socket('https://mobox-app.herokuapp.com')

        io.on('box', async data =>{
            
            const response = await api.get('list')

            this.setState({boxes: response})

        })

    }

    handleDelete = async boxId =>{
        
        // const response = await api.post(`${boxId}/deleteBox`)

        axios.post(`https://mobox-app.herokuapp.com/boxes/${boxId}/deleteBox`)
        .then(response => {
            this.componentDidMount()
            if(response.status === 200){
                this.setState({ show: true })
                this.setState({moboxName: response.data.title})
                this.setState({fileQtt: response.data.files.length})
            }
        })
        .then(response =>{
            setTimeout(function() {
                this.setState({show: false});
            }
            .bind(this), 5000)
        })

        // fetch(`${api}/boxes/${boxId}/deleteBox`)
        // .then(res => console.log('apagou'))
        // .then(json => this.componentDidMount())

    }

    render() {
        
        var shown = {
            
            display: this.state.show ? "block" : "none"

		}
        
        return (
            <div id="box-container">
                <header>
                    <Link to="/" style={{ textDecoration: 'none' }}><img title="Clique aqui para voltar à tela inicial." src={logo} alt="moboxLogo"/></Link>
                    <Link to="/" style={{ textDecoration: 'none' }}><h1 title="Clique aqui para voltar à tela inicial.">MOBOX</h1></Link>
                </header>
                <span>
                    <h4 style={shown}>Mobox {this.state.moboxName} e seu(s) {this.state.fileQtt} arquivo(s) exluído(s) com sucesso.</h4>
                </span>
                <ul>
                    {this.state.boxes.data && this.state.boxes.data.map(box =>(
                        <li key={box._id}>
                            <span className="fileInfo">
                                <Link to={{pathname: `/box/${box._id}`}} style={{ textDecoration: 'none' }}><img className="moboxLista" src={logo} alt="moboxLogo"/></Link>
                                <label className="fileInfo" rel="noopener noreferrer" title="Clique para visualizar os arquivos da mobox.">
                                <Link to={{pathname: `/box/${box._id}`}} style={{ textDecoration: 'none' }}><strong>{box.title}</strong></Link>
                                </label>
                            </span>
                            <span className="fileInfo">criado há{" "} 
                                {distanceInWords(box.createdAt, new Date(), {
                                locale: pt
                            })}
                                <MdDelete title="Excluir" className="cursor" onClick={() => window.confirm(`Deseja realmente deletar Mobox ${box.title} e seu(s) ${box.files.length} arquivo(s)?`) && this.handleDelete(box._id)} size={24} color="#c60707"/>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}