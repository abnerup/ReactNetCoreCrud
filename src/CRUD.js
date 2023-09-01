import React, {useState,useEffect, Fragment} from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { editableInputTypes, isEditable } from '@testing-library/user-event/dist/utils';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CRUD = () => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name,setName] = useState('');
    const [age,setAge] = useState('');
    const [isActive,setIsActive] = useState(0);

    const [editID,setEditID] = useState('');
    const [editName,setEditName] = useState('');
    const [editAge,setEditAge] = useState('');
    const [editIsActive,setEditIsActive] = useState(0);

    const empdata = [
        {
            id:1,
            name : 'Manoj',
            age:29,
            isActive:1
        },
        {
            id:2,
            name : 'abner',
            age:38,
            isActive:1
        },
        {
            id:3,
            name : 'Di',
            age:35,
            isActive:1
        }
    ]
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    },[])

    const getData  = () =>{
        axios.get('https://localhost:7000/api/Employee')
        .then((result)=>{
            setData(result.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7000/api/Employee/${id}`)
        .then((result) => {
            setEditName(result.data.name);
            setEditAge(result.data.age);
            setEditIsActive(result.data.isActive);
            setEditID(id);
        })
    }
    const handleDelete = (id) => {
        if(window.confirm("Tem certeza que deseja deletar o objeto") == true)
        {
            axios.delete(`https://localhost:7000/api/Employee/${id}`)
            .then((result) => {

                if(result.status == 200)
                {
                    toast.success('Operação realizada com sucesso.')
                    getData();
                }

            }).catch((error)=>{
                toast.error('Operação não realizada.')
            })
        }
    }

    const handleUpdate = (id) => {
        const url = `https://localhost:7000/api/Employee/${editID}`;
        const data =  {
            "id": editID,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(url,data)
        .then((result) =>{
            handleClose();
            getData();
            clear();
            toast.success('Operação realizada com sucesso.')
        }).catch((error)=>{
            toast.error('Operação não realizada.')
        })
    }

    
    const handleSave = () => {
        const url = 'https://localhost:7000/api/Employee';
        const data =  {
            "name": name,
            "age": age,
            "isActive": isActive
        }
        axios.post(url,data)
        .then((result) =>{
            getData();
            clear();
            toast.success('Operação realizada com sucesso.')
        }).catch((error)=>{
            toast.error('Operação não realizada.')
        })
    }

    const clear  = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditID('');
    }

    const handleActiveChange = (e) => {
        if(e.target.checked)
        {
            setIsActive(1);
        }  
        else
        {
            setIsActive(0);
        }
    }


  return (
    <Fragment>
        <ToastContainer />
        <Container>
            <Row>
                <Col>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='form-control' placeholder='Enter name'/>
                </Col>
                <Col>
                    <input type='text' value={age} onChange={(e) => setAge(e.target.value)} className='form-control' placeholder='Enter age'/>  
                </Col>
                <Col>
                    <input type='checkbox' 
                    checked={isActive === 1?true : false} 
                    onChange={(e) => handleActiveChange(e)} value={isActive}/>
                    <label>IsActive</label>
                </Col>
                <Col>
                    <button className='btn btn-primary' onClick={()=> handleSave()} >Submit</button>
                </Col>
            </Row>
        </Container>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>IsActive</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    data && data.length > 0 ? 
                    data.map((item,index) => {
                        return( 
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                                <td>{item.isActive}</td>
                                <td colSpan={2}>
                                    <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                    <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                    : 'Loading....'
                }
            </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Edit employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row>
                <Col>
                    <input type='text' value={editName} onChange={(e) => setEditName(e.target.value)} className='form-control' placeholder='Enter name'/>
                </Col>
                <Col>
                    <input type='text' value={editAge} onChange={(e) => setEditAge(e.target.value)} className='form-control' placeholder='Enter age'/>  
                </Col>
                <Col>
                    <input type='checkbox' checked={editIsActive === 1?true : false} onChange={(e) => setEditIsActive(e)} value={editIsActive}/>
                    <label>IsActive</label>
                </Col>
            </Row>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleUpdate}>
                Save Changes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
           
            </Modal.Footer>
        </Modal>
    </Fragment>
  )
}

export default CRUD
