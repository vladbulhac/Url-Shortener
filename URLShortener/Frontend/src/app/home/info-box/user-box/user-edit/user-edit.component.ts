import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User.model';
import { ErrorService } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user-service.service';
import { updateDTO } from 'src/app/DTOs/update_user.dto';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  private user: User;
  private id: string;
  private router: Router;
  private route: ActivatedRoute;
  private userService: UserService;
  private errorService: ErrorService;
  private userSubscription: Subscription;
  public editForm: FormGroup;

  constructor(
    userService: UserService,
    errorService: ErrorService,
    route: ActivatedRoute,
    router: Router
  ) {
    this.userService = userService;
    this.errorService = errorService;
    this.route = route;
    this.router = router;
    this.user = this.userService.getUser();
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
      }
    );

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.user._id !== this.id) this.router.navigate(['']);
    });

    this.editForm = new FormGroup({
      email: new FormControl(this.user.email, [Validators.email]),
      password: new FormControl(null, [Validators.minLength(7)]),
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onSubmit(): void {
    const updateBody = {
      email: this.editForm.value['email'],
    };

    if (
      this.editForm.value['password'] !== null &&
      this.editForm.value['password'].length > 0
    )
      updateBody['password'] = this.editForm.value['password'];

    this.userService.updateUser(updateBody).subscribe(
      (user: updateDTO) => {
        this.userService.setUser(user.data.updatedData);
        this.router.navigate([`u/${this.user._id}`]);
      },
      (error) => {
        this.errorService.setError({
          errorCode: error.error.error.errorCode,
          message: error.error.error.message,
        });
        alert('Could not update your info, check the error message!');
      }
    );
  }
}
