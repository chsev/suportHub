import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/services/account.service';
import { PostService } from 'src/app/post/services/post.service';
import { Post } from 'src/app/shared/models/post.model';
import { Profile } from 'src/app/shared/models/profile.model';
import { User } from 'src/app/shared/models/user.model';
import { TeamService } from 'src/app/team/services/team.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  teamPosts: Post[] = [];
  companyPosts: Post[] = [];
  authors: Profile[] = [];
  user: User | undefined;
  private userDataChangedSub: Subscription | undefined;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private teamService: TeamService,
    private postService: PostService,
  ) { }


  ngOnInit(): void {
    this.getUser();
  }


  ngOnDestroy(): void {
    this.userDataChangedSub?.unsubscribe();
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe((userData: User) => {
        this.user = userData;
        this.getCompanyPosts(userData.companyId);
        this.fetchUserTeams(userData);
      });
    this.accountService.fetchUserData();
  }


  private fetchUserTeams(user: User) {
    if (user.companyId && user.id) {
      let teamSub = this.teamService.fetchUserTeams(user.companyId, user.id)
        .subscribe((teams) => {
          let userTeamIds = teams.map(e => e.id!);
          this.fetchTeamPosts(userTeamIds, user);
          teamSub.unsubscribe();
        });
    }
  }


  //==================
  //   Posts:
  //==================
  private fetchTeamPosts(userTeamIds: string[], user: User) {
    userTeamIds.forEach((teamId) => {
      this.postService.fetchTeamPosts(user.companyId!, teamId)
        .subscribe((posts) => {
          posts.forEach(e => this.addPost(e));
          this.fetchAuthors(this.posts.map(e => e.usrId));
        });
    });
  }


  private getCompanyPosts(companyId: string | undefined) {
    if (!companyId)
      return;

    this.postService.fetchCompanyPosts(companyId)
      .subscribe(posts => {
        posts.forEach(e => this.addPost(e));
        this.fetchAuthors(this.posts.map(e => e.usrId));
      });
  }


  private addPost(post: Post) {
    let i = this.posts.findIndex(e => e.id == post.id);

    if (i > -1) {
      this.posts[i] = post;
      this.orderPosts();
      return;
    }
    this.posts.push(post);
    this.orderPosts();
  }


  private orderPosts() {
    this.posts = this.posts.sort((a, b) => b.created!.seconds - a.created!.seconds);
  }


  private fetchAuthors(authorsIds: string[]) {
    authorsIds = [...new Set(authorsIds)]; //remove duplicates
    authorsIds.forEach(id => {
      let i = this.authors.findIndex(e => e.id === id);
      if (i == -1) {
        let profileSub = this.accountService.fetchProfile(id)
          .subscribe((profile) => {
            this.authors.push(profile);
            profileSub.unsubscribe();
          });
      }
    });
  }


  toDate(timestamp: Timestamp) {
    return timestamp.toDate().toLocaleString('pt-br');
  }


  getAuthor(id: string): Profile | undefined {
    return this.authors.find(e => e.id == id);
  }


  toggleLike(postId: string) {
    this.postService.toggleLike(this.user?.companyId!, postId, this.user?.id!);
  }


  userLiked(post: Post): boolean {
    if (this.user && post) {
      return post.liked.includes(this.user.id!);
    }
    return false;
  }


  viewPost(postId: string) {
    this.router.navigate(['post/view', postId]);
  }

}
