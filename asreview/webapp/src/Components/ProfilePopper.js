import { GroupAdd, Logout, Person } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  ButtonBase,
  ClickAwayListener,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import { StyledMenuItem } from "StyledComponents/StyledMenuItem";
import { TypographySubtitle1Medium } from "StyledComponents/StyledTypography";

import { AuthAPI, TeamAPI } from "api";
import ElasAvatar from "images/ElasAvatar.svg";

import { InvitationsDialog } from "ProjectComponents/TeamComponents";
import { useToggle } from "hooks/useToggle";

const SignOutItem = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: handleSignOut } = useMutation(AuthAPI.signout, {
    onSuccess: () => {
      queryClient.invalidateQueries();
      navigate("/signin");
    },
  });

  return (
    <MenuItem id="signout" onClick={handleSignOut}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      <ListItemText disableTypography>
        <Typography variant="body2">Sign out</Typography>
      </ListItemText>
    </MenuItem>
  );
};

const ProfilePopper = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [projectInvitations, setProjectInvitations] = React.useState([]);
  const [onAcceptanceDialog, toggleAcceptanceDialog] = useToggle();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const { data } = useQuery("user", AuthAPI.user, {
    retry: false,
    onError: (response) => {
      console.log(response);
      response.code === 401 && navigate("/signin");
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const openAcceptanceDialog = () => {
    setOpen(false);
    toggleAcceptanceDialog();
  };
  const handleProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  useQuery(["getProjectInvitations"], () => TeamAPI.getProjectInvitations(), {
    onSuccess: (data) => {
      setProjectInvitations(data["invited_for_projects"] || []);
    },
    enabled: window.allowTeams,
  });

  const acceptInvitation = useMutation(
    (project) => TeamAPI.acceptInvitation(project.project_id),
    {
      onSuccess: (response, project) => {
        // refetch all projects
        queryClient.invalidateQueries({
          queryKey: ["fetchProjects", project.mode],
        });
        // filter out accepted project
        const newProjectList = projectInvitations.filter(
          (p) => p.id !== project.id,
        );
        // reset invitations
        setProjectInvitations(newProjectList);
        // close modal if there are no more invitations
        if (newProjectList.length === 0) {
          toggleAcceptanceDialog();
        }
      },
    },
  );
  const rejectInvitation = useMutation(
    (project) => TeamAPI.rejectInvitation(project.project_id),
    {
      onSuccess: (response, project) => {
        // filter out rejected project
        const newProjectList = projectInvitations.filter(
          (p) => p.id !== project.id,
        );
        // reset invitations
        setProjectInvitations(newProjectList);
        // close modal if there are no more invitations
        if (newProjectList.length === 0) {
          toggleAcceptanceDialog();
        }
      },
    },
  );

  return (
    <div>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          <Tooltip title="Profile">
            <ButtonBase id="profile-popper" onClick={handleClick}>
              <Avatar
                alt="user"
                src={ElasAvatar}
                sx={(theme) => ({
                  bgcolor: "grey.400",
                  ...theme.applyStyles("dark", {
                    bgcolor: "grey.600",
                  }),
                })}
                imgProps={{ sx: { p: 1 } }}
              />
            </ButtonBase>
          </Tooltip>
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
            sx={{ zIndex: "tooltip", mt: "8px !important" }}
          >
            <Paper variant="outlined">
              <MenuList>
                <StyledMenuItem>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                  >
                    <Avatar
                      alt="user"
                      src={ElasAvatar}
                      sx={(theme) => ({
                        bgcolor: "grey.400",
                        ...theme.applyStyles("dark", {
                          bgcolor: "grey.600",
                        }),
                      })}
                      imgProps={{ sx: { p: 1 } }}
                    />
                    <TypographySubtitle1Medium>
                      {data?.name}
                    </TypographySubtitle1Medium>
                  </Stack>
                </StyledMenuItem>
                <Divider />
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText disableTypography>
                    <Typography variant="body2">Profile</Typography>
                  </ListItemText>
                </MenuItem>
                {window.allowTeams && projectInvitations.length > 0 && (
                  <MenuItem onClick={openAcceptanceDialog}>
                    <ListItemIcon>
                      <Badge
                        badgeContent={projectInvitations.length}
                        sx={{
                          "& .MuiBadge-badge": {
                            color: "white",
                            backgroundColor: "red",
                            fontSize: 9,
                          },
                        }}
                      >
                        <GroupAdd fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText disableTypography>
                      <Typography variant="body2">
                        Collaboration Invites
                      </Typography>
                    </ListItemText>
                  </MenuItem>
                )}
                <SignOutItem />
              </MenuList>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>
      {window.allowTeams && data && (
        <InvitationsDialog
          open={onAcceptanceDialog}
          onClose={toggleAcceptanceDialog}
          userId={data.id}
          projectInvitations={projectInvitations}
          handleAcceptance={acceptInvitation.mutate}
          handleRejection={rejectInvitation.mutate}
        />
      )}
    </div>
  );
};
export default ProfilePopper;
