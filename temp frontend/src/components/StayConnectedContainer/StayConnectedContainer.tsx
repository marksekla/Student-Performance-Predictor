import { Box, Typography } from "@mui/material";
import ContactUs from "./ContactUs";
import React from "react";

export default function StayConnectedContainer(props: { id?: string }) {
    return (
        <Box
            id={props?.id}
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography id="contact-us" sx={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center' }}>
                Stay Connected!
            </Typography>
            <Typography sx={{ textAlign: 'center' }}>
                Stay updated on our latest research and connect with us for insights!
            </Typography>
            <ContactUs sx={{ marginTop: '25px' }} fontSize="2rem" />
        </Box>
    );
}
