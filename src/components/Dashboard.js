import * as React from 'react';
import { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AddRentals } from './AddRentals';
import SortableTable from './SortableTable';
import { useNavigate } from 'react-router-dom';
import { useRentalContext } from '../context/RentalContext';
import { url } from '../constants';

const defaultTheme = createTheme({
});

function createData(id, rentalName, rentalAddress, renterName, rentAmount) {
  return {
    id,
    rentalName,
    rentalAddress,
    renterName,
    rentAmount
  };
}

export default function Dashboard() {
  const { state, setState } = useRentalContext();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [rentals, setRentals] = React.useState([]);
  let rows = []

  const useAuthorized = (() => {
    useEffect(() => {
      if (!state.isAuthorized) {
        navigate('signin');
      } else {
        fetch(`${url}/listRentals`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('List rentals successful!');
              }
              return response.json();
            })
            .then(data => {
              let newRows = []
              data.forEach((rental, index) => {
                  newRows.push(createData(index, rental.rental_name, rental.rental_address, rental.renter_name, rental.rent_amount));
              });
              rows = newRows.slice();
              setRentals(rows);     
              console.log('Listing rows: ', rows);         
            })
            .catch(error => {
              console.error('Error listing rentals', error);
            });
      }
    }, [navigate, setRentals]);
    return state.authVerified;
  });
  

  return (useAuthorized() && (
    <ThemeProvider theme={defaultTheme}>
    <Box sx={{ width: '100%' }}>
      <Tabs
        onChange={handleChange}
        value={value}
        aria-label="Tabs where selection follows focus"
        selectionFollowsFocus
        centered
        role="navigation"
        sx = {{marginBottom: 8,
          minHeight: '50px', height: '50px'
        }}
      >
        <Tab label={<Typography variant="h6">Add Rentals</Typography>}
        sx={{ 
          textTransform: "none", 
        }} />
        <Tab label={<Typography variant="h6">View Rentals</Typography>} sx={{ 
          textTransform: "none", 
        }} />
      </Tabs>

      { value === 0 && (<AddRentals></AddRentals>) }
      { value === 1 && (<SortableTable rentals={rentals}></SortableTable>) }

    </Box>
    </ThemeProvider>
  ));
}