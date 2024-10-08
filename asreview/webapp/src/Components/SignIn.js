import * as React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Fade,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { HelpPrivacyTermsButton, SignInForm } from "Components";

import { WordMark } from "icons/WordMark";
import SignInOAuth from "./SignInOAuth";

const PREFIX = "SignInForm";

const classes = {
  button: `${PREFIX}-button`,
  card: `${PREFIX}-card`,
  cardContent: `${PREFIX}-card-content`,
  checkbox: `${PREFIX}-checkbox`,
  header: `${PREFIX}-header`,
};

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  [`& .${classes.button}`]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    justifyContent: "space-between",
  },
  [`& .${classes.card}`]: {
    borderRadius: theme.spacing(2),
    width: "450px",
  },
  [`& .${classes.cardContent}`]: {
    padding: "48px 40px",
  },
  [`& .${classes.header}`]: {
    alignItems: "center",
  },
}));

const SignIn = ({ allowAccountCreation, emailVerification, oAuthConfig }) => {
  return (
    <Root>
      <Fade in>
        <Box>
          <Card className={classes.card} variant="outlined">
            <CardContent className={classes.cardContent}>
              <Stack spacing={3}>
                <Stack className={classes.header} spacing={2}>
                  <WordMark style={{ width: "100%", maxWidth: "130px" }} />
                  <Typography variant="h5">Sign in</Typography>

                  {typeof window.loginInfo === "string" &&
                    window.loginInfo.length > 0 && (
                      <Alert severity="info">{window.loginInfo}</Alert>
                    )}
                </Stack>
                <SignInForm
                  classes={classes}
                  allowAccountCreation={allowAccountCreation}
                  emailVerification={emailVerification}
                />
                {oAuthConfig?.services &&
                  Object.keys(oAuthConfig.services).length > 0 && (
                    <SignInOAuth classes={classes} oAuthConfig={oAuthConfig} />
                  )}
              </Stack>
            </CardContent>
          </Card>
          <HelpPrivacyTermsButton />
        </Box>
      </Fade>
    </Root>
  );
};

export default SignIn;
