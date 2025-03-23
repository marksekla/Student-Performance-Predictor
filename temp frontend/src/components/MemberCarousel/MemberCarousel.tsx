import React from 'react';
import { Box, Typography, SxProps } from '@mui/material';

// Define the member interface
interface CarouselMember {
  firstName: string;
  lastName: string;
  leadership: string[];
  imagePath: string;
}

function MemberLeaderString(member: CarouselMember): string {
  return member.leadership.join(", ");
}

function MemberCarousel(props?: { id: string, sx?: SxProps }) {
  // Define static team members with paths to the public folder
  const staticMembers: CarouselMember[] = [
    {
      firstName: "Mitch",
      lastName: "Buchanan",
      leadership: ["Team Member"],
      imagePath: "/mitchbuchanan.jpg"
    },
    {
      firstName: "Mark",
      lastName: "Sekla",
      leadership: ["Team Member"],
      imagePath: "/marksekla.jpeg"
    },
    {
      firstName: "Salman",
      lastName: "Chowdhury",
      leadership: ["Team Member"],
      imagePath: "/salmanchowdhury.jpeg"
    }
  ];

  return (
    <Box
      {...props}
      sx={{
        ...props?.sx,
        display: "flex",
        flexDirection: 'column',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        padding: "40px 0",
        // No background color or gradient
      }}
    >
      <Typography sx={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '60px',
        textAlign: 'center',
        color: 'white'
      }}>
        Our Team
      </Typography>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: '40px',
        flexWrap: { xs: 'wrap', md: 'nowrap' } // Stack on mobile, side by side on desktop
      }}>
        {staticMembers.map((member, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              width: '300px',
              height: '400px',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.5)",
              }
            }}
          >
            <img
              src={member.imagePath}
              alt={`${member.firstName} ${member.lastName}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />
            <Box sx={{
              position: 'absolute',
              bottom: '0',
              width: '100%',
              background: "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0) 100%)",
              textAlign: 'center',
              padding: '30px 15px 20px',
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', color: "white", mb: 1 }}>
                {`${member.firstName} ${member.lastName}`}
              </Typography>
              <Typography sx={{ fontSize: '0.95rem', color: "rgba(255, 255, 255, 0.9)" }}>
                {MemberLeaderString(member)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MemberCarousel;
