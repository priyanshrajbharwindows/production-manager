import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Factory, Database, Server, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <AppHeader
        title="Settings"
        description="System configuration and information"
      />

      <div className="p-6 space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">NEXUS Consumer Care</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">Cleaning & Hygiene Products</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">India</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Version</p>
                <Badge variant="outline">v1.0.0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              Database
            </CardTitle>
            <CardDescription>Connected database information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Server className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-medium">Supabase PostgreSQL</p>
                <p className="text-sm text-muted-foreground">Connected and operational</p>
              </div>
              <Badge className="ml-auto bg-success/20 text-success border-success/30">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning" />
              System Modules
            </CardTitle>
            <CardDescription>Active production management modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Dashboard & Analytics",
                "Production Management",
                "Product Catalog",
                "Raw Material Inventory",
                "Bill of Materials",
                "Dispatch Management",
                "Reports & Export",
              ].map((module) => (
                <div key={module} className="flex items-center gap-2 rounded-lg border border-border/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm">{module}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
