import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import FormInput from '../../../../../components/Dashboard/Form/FormInput/FormInput'
import { flightFacility, flightForm, flightTerminal } from '../../../../../lib/Flight/FlightForm'
import DashboardLayout from '../../../../../template/DashboardLayout/DashboardLayout'
import { changeDate } from '../../../../common/helper'
import { showLoading, successLoading } from '../../../../common/loadingHandler'
import { useGetAllAirlineQuery } from '../../../../features/airline/airlineApi'
import { useCreateFlightMutation } from '../../../../features/flight/flightApi'
import { useCreateSeatMutation } from '../../../../features/seat/seatApi'

const CreateFlight = () => {
  const {data:airlines, isLoading, isSuccess} = useGetAllAirlineQuery()
  const [createFlight, {isLoading : isLoadingCreateFlight, isSuccess: isSuccessCreateFlight, isError}] = useCreateFlightMutation()
  const [createSeat] = useCreateSeatMutation()
  const [flight, setFlight] = useState({  
    id_airline: "",
    departure_date: "",
    // departure_time: "",
    arrived_date : "",
    // arrived_time : "",
    // starting_place : "",
    // destination_place : "",
    transit : "direct",
    luggage : false,
    meal : false,
    wifi : false,
    type_trip : "one way",
    class_flight : "first class",
    terminal : "",
    // gate : "",
    // price : ""
  })

  const convertToNumber = (type, data) => {
    if(type && type == 'number'){
      return Number(data)
    }
    return data
  } 


  const changeHandler = (e) => {
    setFlight(prev => {
      return {
        ...prev,
        [e.target.name] : convertToNumber(e.target.type, e.target.value)
      }
    })
  }

  function setCapacity(classFlight)  {
    if(classFlight == "economy") return 120
    if(classFlight == "business") return 36
    if(classFlight == "first class") return 8
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const res = await createFlight({
      ...flight, 
      capacity: setCapacity(flight?.class_flight),
      departure_date: changeDate(flight.departure_date), 
      arrived_date: changeDate(flight.arrived_date)
    })

    await createSeat({id_flight: res.data.id, type_seat: res.data.class_flight})
  }

  useEffect(() => {
    if(isSuccessCreateFlight) successLoading('Success Create flight')
    if(isLoadingCreateFlight) showLoading('Please Wait...')
    if(isError) Swal.close()

  }, [isLoadingCreateFlight, isSuccessCreateFlight, isError])

  return (
    <DashboardLayout title={`Create New Flight`}>
      <div className="row">
        <div className="col-12">
        <Form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-12 col-sm-6 col-md-4">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Choose Airlane</Form.Label>
              <Form.Select aria-label="Default select example" name='id_airline' onChange={changeHandler}>
                <option value={`none`}>Choose</option>
                {airlines?.map((airline, i) => (
                  <option key={i} value={airline.id}>{airline.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            </div>
           
           {flightForm.map((input,i) => (
            <div key={i} className="col-12 col-sm-6 col-md-4">
              <FormInput 
                title={input.title}
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                onchange={(e) => changeHandler(e)}
              />
            </div>
           ))}
         
          <div className="col-12 col-sm-6 col-md-4">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Terminal</Form.Label>
              <Form.Select aria-label="Default select example" name={`terminal`} onChange={changeHandler}>
                {flightTerminal?.map((terminal, i) => (
                   <option key={i} value={terminal}>{terminal}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Transit</Form.Label>
              <Form.Select aria-label="Default select example" name='transit' onChange={changeHandler}>
                <option value={`direct`}>Direct</option>
                <option value={`transit`}>Transit</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Class</Form.Label>
              <Form.Select aria-label="Default select example" name='class_flight' onChange={changeHandler}>
                  <option selected>Choose Class</option>
                  <option value="economy">economy</option>
                  <option value="business">business</option>
                  <option value="first class">first class</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Type Trip</Form.Label>
              <Form.Select aria-label="Default select example" name='type_trip' onChange={changeHandler}>
                <option value={`one way`}>one way</option>
                <option value={`rounded trip`}>rounded trip</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <FormInput 
              title={`Gate`}
              type={'number'}
              name={'gate'}
              placeholder={`Input number of gate`}
              onchange={(e) => changeHandler(e)}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-4 d-flex">
            <Form.Group className="mb-3" controlId={'name'}>
              <Form.Label className='fw-semibold'>{`Facilities`}</Form.Label>
              <div className="d-flex gap-3">
                {flightFacility.map((facility, i) => (
                  <Form.Check
                    key={i} 
                    type={`checkbox`}
                    id={`default-${facility}`}
                    name={facility}
                    label={facility}
                    onChange={(e) => setFlight(prev => ({...prev, [e.target.name] : !prev[facility] }))}
                  />
                ))}
              </div>
            </Form.Group>
          </div>
          <div className="col-12 col-sm-6 col-md-4 offset-0 offset-md-4 d-flex align-items-end">
            <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
              <Button variant="primary" className='w-100' type="submit">
                Create Flight
              </Button>
            </Form.Group>
          </div>

          </div>
        </Form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateFlight