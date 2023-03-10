import React from 'react'
import { Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { useParams } from 'react-router-dom';
import { useGetFlightByIdQuery } from '../../../src/features/flight/flightApi';
import { useGetSeatByIdFlightQuery } from '../../../src/features/seat/seatApi';
import ProfileInputForm from '../../Forms/ProfileInputForm/ProfileInputForm';

const PassangerCard = ({data, onchange}) => {
  const {id} = useParams()
  const {data:seats} = useGetSeatByIdFlightQuery({id, limit: 50}, {skip: id ? false : true})
  const changeHandler = (e) => {
    onchange(e)
  }
  return (
    <>
      <Alert className='py-2 d-flex align-items-center flex-wrap justify-content-between' variant={`primary`}>
        <span className='text-medium'>Passanger</span>
        <div className='d-flex gap-2 align-items-start'>
          <span className='d-block text-medium'>Same as contact person</span>
          <Form.Check 
            className='shadow-none bg-success'
            type="switch"
            id="custom-switch"
          />
        </div>
      </Alert>
      <ProfileInputForm 
        title={`Full Name`}
        name={`name`}
        type={`text`}
        // value={data.name}
        onchange={(e) => changeHandler(e)}
        placeholder={`Input Your Full Name`}
      />

      <Form.Label className="text-secondary text-medium ps-2 mb-2">Select Seat</Form.Label>
      <Form.Select 
        aria-label="Default select example" 
        className='mb-3 shadow-none' 
        name={'id_seat'} 
        onChange={changeHandler}>
          <option selected>Select Seat</option>
          {seats?.map((seat, i) => (
            <option key={i} value={seat?.id}>{seat?.no_seat}</option>
          ))}
      </Form.Select>
      
      <Form.Label className="text-secondary text-medium ps-2 mb-2">Passenger Type</Form.Label>
      <div>
        <form className="d-flex gap-4">
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="radio" 
              name="category_passenger" 
              id="flexRadioDefault1" 
              value={'child'}
              onChange={changeHandler} 
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Child
            </label>
          </div>
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="radio" 
              name="category_passenger" 
              id="flexRadioDefault2"
              value={'adult'}
              onChange={changeHandler}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Adult
            </label>
          </div>
        </form>
      </div>
    </>
  )
}

export default PassangerCard