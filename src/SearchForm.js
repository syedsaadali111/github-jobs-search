import React from 'react';
import { Form, Col } from 'react-bootstrap';

const SearchForm = ({params, onParamChange}) => {
    return (
        <Form>
            <Form.Row className="align-items-end">
                <Form.Group as={Col}>
                    <Form.Label>Description</Form.Label>
                    <Form.Control onChange={onParamChange} value={params.description} name="description" type="text"/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Location</Form.Label>
                    <Form.Control onChange={onParamChange} value={params.location} name="location" type="text"/>
                </Form.Group>
                <Form.Group as={Col} xs="auto">
                    <Form.Check onChange={onParamChange} name="full_time" value={params.full_time} label="Full-time Only" type="checkbox" className="mb-2"/>
                </Form.Group>
            </Form.Row>
        </Form>
    );
}
 
export default SearchForm;