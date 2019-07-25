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

    state = { boxes: {}, show: false, showVazio: false, moboxName: '', fileQtt: 0 }

    async componentDidMount(){

        this.subscribeToNewFiles()
        
        const response = await api.get('list')

        this.setState({boxes: response})
        
        this.verificaVazio(response)

    }

    verificaVazio = (response) =>{

        if(response.data.length === 0){
            
            this.setState({showVazio: true})

        }else{

            this.setState({showVazio: false})

        }

    }

    subscribeToNewFiles = () =>{
        
        const io = socket('https://mobox-app.herokuapp.com')

        io.on('box', async data =>{
            
            // console.log(JSON.stringify(data))

            const response = await api.get('list')

            this.setState({boxes: response})

            this.verificaVazio(response)

        })

    }

    verificaBox = async (boxId) =>{

        const response = await api.get(`boxes/${boxId}`)
        this.setState({fileQtt: response.data.files.length})

    }

    handleDelete = async boxId =>{
        
        // const response = await api.post(`${boxId}/deleteBox`)

        axios.post(`https://mobox-app.herokuapp.com/boxes/${boxId}/deleteBox`)
        .then(response => {
            this.componentDidMount()
            if(response.status === 200){
                this.setState({ show: true })
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

    exclusao = async (id, title) =>{

        this.setState({moboxName: title})

        await this.verificaBox(id) 
        
        await window.confirm(`Deseja realmente deletar Mobox ${title} e seu(s) ${this.state.fileQtt} arquivo(s)?`) && await this.handleDelete(id)

    }

    render() {
        
        var shown = {
            
            display: this.state.show ? "block" : "none"

        }
        
        var shownVazio = {
            
            display: this.state.showVazio ? "block" : "none"

		}
        
        return (
            <div id="box-container">
                <header>
                    <Link to="/" style={{ textDecoration: 'none' }}><img title="Clique aqui para voltar à tela inicial." src={logo} alt="moboxLogo"/></Link>
                    <Link to="/" style={{ textDecoration: 'none' }}><h1 title="Clique aqui para voltar à tela inicial.">MOBOX</h1></Link>
                </header>
                <span>
                    <h4 style={shownVazio}>Não há Mobox para serem mostradas.</h4>
                </span>
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
                                <MdDelete title="Excluir" className="cursor" onClick={() => this.exclusao(box._id, box.title)} size={24} color="#c60707"/>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}