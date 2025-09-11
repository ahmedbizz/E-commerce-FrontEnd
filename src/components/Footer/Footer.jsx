import { Box, MenuItem, Link, MenuList } from "@mui/material";
import React from "react";
import YouTube from "@mui/icons-material/YouTube";
import Facebook from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import Instagram from "@mui/icons-material/Instagram";
const Footer = () => {
  const info = [
    {
      name: "GET HELP",
      url: "",
      content: [
        { name: "Sipping and Delivery", url: "" },
        { name: "Returns", url: "" },
        { name: "payment Options", url: "" },
        { name: "Cuntact us", url: "" },
      ],
    },
    {
      name: "ABOUT US",
      url: "",
      content: [
        { name: "Sipping and Delivery", url: "" },
        { name: "Returns", url: "" },
        { name: "payment Options", url: "" },
        { name: "Cuntact us", url: "" },
      ],
    },
    {
      name: "APPS",
      url: "",
      content: [
        { name: "Sipping and Delivery", url: "" },
        { name: "Returns", url: "" },
        { name: "payment Options", url: "" },
        { name: "Cuntact us", url: "" },
      ],
    },
  ];

  return (
    <Box className="Footer">
      <Box className="Head-Footer">
        <Box className="Head-left">
          <MenuList className="MenuList">
            <MenuItem>FIND A STORE</MenuItem>
            <MenuItem>SING UP</MenuItem>
          </MenuList>
        </Box>
        <Box className="Head-Main">
          {(info || []).map((item, index) => (
            <MenuList key={index}>
              <MenuItem>{item.name}</MenuItem>
              {(item.content || []).map((cate, index) => (
                <MenuList
                  key={index}
                >
                  <MenuItem>{cate.name}</MenuItem>
                </MenuList>
              ))}
            </MenuList>
          ))}
        </Box>
        <Box className="Head-rghit">
          <Twitter />
          <Facebook />
          <YouTube />
          <Instagram />
        </Box>
      </Box>
      <Box className="buttom-Footer">
        <Box className="buttom-left">Languege</Box>
        <Box className="buttom-rghit">terms us </Box>
      </Box>
    </Box>
  );
};

export default Footer;
