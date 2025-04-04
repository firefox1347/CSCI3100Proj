import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { Avatar, Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Menu = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1,
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  maxHeight: 300,
  overflow: "auto",
}));

const MenuItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordForSearch, setWordForSearch] = useState("");
  const blurTimer = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      blurTimer.current && clearTimeout(blurTimer.current);
      debounceTimer.current && clearTimeout(debounceTimer.current);
    };
  }, []);

  const { data: userList } = useQuery({
    queryKey: [wordForSearch],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/${wordForSearch}`);
      return res.data.user;
    },
    enabled: wordForSearch !== "",
  });

  const handleInputChange = (value) => {
    setSearchTerm(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setWordForSearch(value), 500);
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        onBlur={() => {
          blurTimer.current = setTimeout(() => {
            setSearchTerm("");
            setWordForSearch("");
          }, 100);
        }}
      />

      {userList?.length > 0 && (
        <Menu>
          {userList.map((user) => (
            <MenuItem
              key={user._id}
              onMouseDown={(e) => {
                e.preventDefault();
                setSearchTerm("");
                setWordForSearch("");
                navigate(`/profile/${user.username}`);
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* when click avatar should link to bio */}
                <Avatar
                  src={user.avatar_url}
                  alt="user profile pic"
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" fontWeight="bold" color="black">
                    {user.username}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Search>
  );
};
export default SearchBar;
