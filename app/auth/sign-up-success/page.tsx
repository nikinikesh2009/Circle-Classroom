import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Typography } from "@mui/material"
import Link from "next/link"

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
        p: 2,
      }}
    >
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We've sent you a confirmation email. Please check your inbox and click the confirmation link to activate
              your account.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              After confirming, you can{" "}
              <Link href="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 600 }}>
                sign in here
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Box>
  )
}
