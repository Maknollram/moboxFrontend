import React, { Component } from "react";
import api from "../../services/api";
import axios from 'axios';
import {MdInsertDriveFile} from 'react-icons/md';
import {MdDelete} from 'react-icons/md';
import {distanceInWords} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';
import logo from "../../assets/moboxMin.png";
import upload from "../../assets/upload.png";
import { Link } from 'react-router-dom';
import "./styles.css";

export default class Box extends Component {

    state = { box: {}, show: false, showVazio: false, moboxName: '' }

    async componentDidMount(){

        this.subscribeToNewFiles()
        
        const box = this.props.match.params.id

        const response = await api.get(`boxes/${box}`)

        this.setState({box: response.data})

        this.verificaVazio(response.data.files)

    }

    verificaVazio = (response) =>{

        if(response.length === 0){
            
            this.setState({showVazio: true})

        }else{

            this.setState({showVazio: false})

        }

    }

    subscribeToNewFiles = () =>{
        
        const box = this.props.match.params.id

        const io = socket('https://mobox-app.herokuapp.com')

        io.emit('connectRoom', box)

        io.on('file', data =>{
            
            this.setState({box: {...this.state.box, files: [data, ...this.state.box.files]}})
            
            this.verificaVazio(data)

        })

        io.on('delete', data =>{
            
            this.setState({box: data})
            
            this.verificaVazio(data.files)

        })

    }

    handleUpload = (files) =>{
        
        files.forEach(file => {
            
            const data = new FormData()

            const box = this.props.match.params.id

            data.append('file', file)

            api.post(`boxes/${box}/files`, data)
            .catch(response =>{
                console.log(response)
            })
        })

    }

    handleDelete = async (boxId, fileId) =>{
        
        // api.post(`/boxes/${boxId}/deleteFile`, {fileId: fileId})
        axios.post(`https://mobox-app.herokuapp.com/boxes/${boxId}/deleteFile`, {fileId: fileId})
        .then(response => {
           
            if(response.status === 200){
                
                this.setState({ show: true })
                
                this.setState({fileName: response.data.title})

            }

        })
        .then(response =>{
            
            setTimeout(function() {
               
                this.setState({show: false});

            }
            .bind(this), 5000)

        })

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
                    <h2>
                        {this.state.box.title}
                    </h2>
                </header>
                <Dropzone onDropAccepted={this.handleUpload}>
                    {({getRootProps, getInputProps}) =>(
                        <div className="upload" {... getRootProps()}>
                            <input {... getInputProps()}/>
                            <img src={upload} alt="upload"/>
                            <p>Arraste arquivos ou clique aqui para fazer uploads.</p>
                        </div>
                    )}
                </Dropzone>
                <span>
                    <h4 style={shownVazio}>Não há arquivos a serem mostrados nesta Mobox.</h4>
                </span>
                <span>
                    <h4 className="fileInfo" style={shown}>Arquivo {this.state.fileName} foi exluído com sucesso.</h4>
                </span>
                <ul>
                    {this.state.box.files && this.state.box.files.map(file =>(
                        <li key={file._id}>
                            <a className="fileInfo" href={file.url} target="_blank" rel="noopener noreferrer">
                                <MdInsertDriveFile size={24} color="#26ce10"/>
                                <strong>{file.title}</strong>
                            </a>
                            <span className="fileInfo">criado há{" "} 
                                {distanceInWords(file.createdAt, new Date(), {
                                locale: pt
                            })}
                                <MdDelete title="Excluir Arquivo" className="cursor" onClick={() => window.confirm(`Deseja realmente deletar o arquivo ${file.title}?`) &&  this.handleDelete(this.state.box._id, file._id)} size={24} color="#c60707"/>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}