import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["nav-menu.component.scss"],
})
export class NavMenuComponent implements OnInit {
  public headerTitle: string = "";
  public currentRoute: string = "";
  public applicationNumber: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.route.params.subscribe((params) => {
        this.applicationNumber = params["applicationNumber"]

        if (this.currentRoute === "/create-application") {
            this.headerTitle = "Create Application";
        } else if (this.currentRoute.startsWith("/edit-application")) {
            this.headerTitle = `Application ${this.applicationNumber}`
        } else {
            this.headerTitle = "Application Manager";
        }
    })
  }
}
