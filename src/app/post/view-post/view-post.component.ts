import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Msg } from 'src/app/shared/models/msg.model';
import { Post } from 'src/app/shared/models/post.model';
import { Timestamp } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { User } from 'src/app/shared/models/user.model';
import { AccountService } from 'src/app/account/services/account.service';
import { Subscription } from 'rxjs';
import { Profile } from 'src/app/shared/models/profile.model';
import { UiService } from 'src/app/shared/services/ui.service';


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  user: User | undefined;
  companyId: string | undefined;
  post: Post | undefined;
  originalMsg: Msg | undefined;
  replyMsgs: Msg[] = [];
  authors: Profile[] = [];
  orderMsgBy: 'mostVoted' | 'newest' | 'oldest' = 'mostVoted';
  hideEditor = false;
  form: FormGroup;
  isLoading = false;

  private userDataChangedSub: Subscription | undefined;
  private loadingSub: Subscription | undefined;


  constructor(
    fb: FormBuilder,
    private uiService: UiService,
    private route: ActivatedRoute,
    private postService: PostService,
    private accountService: AccountService,
    private router: Router,
  ) {
    this.form = fb.group({
      editor: new UntypedFormControl('', { validators: [Validators.required] }),
    });
  }


  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(isLoading => this.isLoading = isLoading);

    this.getUser();
    let postId = this.route.snapshot.params['id'];
    this.postService.getPostById(postId)
      .subscribe((data) => {
        this.post = data.post;
        this.companyId = data.companyId;
        this.originalMsg = data.msgs.find(e => e.type == 'original');
        this.replyMsgs = data.msgs.filter(e => e.type == 'reply');
        this.orderMsgs();
        let authorsIds = [...new Set(data.msgs.map(e => e.usrId))]; //remove duplicates
        this.getAuthors(authorsIds);
        this.addView(data.companyId, postId);
      });
  }

  private viewAdded = false;
  
  addView(companyId: string, postId: string){
    if(!this.viewAdded){
      this.postService.addView(companyId, postId);
      this.viewAdded = true;
    }
  }


  ngOnDestroy(): void {
    this.userDataChangedSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }


  private getUser() {
    this.userDataChangedSub = this.accountService.userDataChanged
      .subscribe((userData: User) => this.user = userData);
    this.accountService.fetchUserData();
  }


  private getAuthors(authorsIds: string[]) {
    this.accountService.fetchProfileList(authorsIds)
      .subscribe((profiles) => {
        this.authors = profiles;
      });
  }


  orderMsgs() {
    switch (this.orderMsgBy) {
      case 'mostVoted':
        this.replyMsgs = this.replyMsgs.sort((a, b) => this.netVote(b) - this.netVote(a));
        break;
      case 'newest':
        this.replyMsgs = this.replyMsgs.sort((a, b) => b.created!.seconds - a.created!.seconds);
        break;
      case 'oldest':
        this.replyMsgs = this.replyMsgs.sort((a, b) => a.created!.seconds - b.created!.seconds);
        break;
    }
  }


  //=======
  // Post
  //=======
  canEdit(): boolean {
    return (this.post?.usrId === this.user?.id);
  }


  onEdit() {
    if(this.post){
      this.router.navigate(['post/edit'], { state: { postId: this.post.id, teamId: this.post.teamId} });;
    }
  }

  
  onDelete(){
    if(this.companyId && this.post){
      this.postService.delete(this.companyId, this.post.id!);
    }
  }


  toggleLike() {
    if (this.companyId && this.post && this.user) {
      this.postService.toggleLike(this.companyId, this.post.id!, this.user.id!);
    }
  }


  userLiked(): boolean {
    if (this.user && this.post) {
      return this.post.liked.includes(this.user.id!);
    }
    return false;
  }


  //========
  // Vote
  //========
  upvote(msgId: string) {
    if (this.companyId && this.post && this.user) {
      this.postService.upvoteComment(this.companyId, this.post.id!, msgId, this.user.id!);
    }
  }


  downvote(msgId: string) {
    if (this.companyId && this.post && this.user) {
      this.postService.downvoteComment(this.companyId, this.post.id!, msgId, this.user.id!);
    }
  }


  netVote(message: Msg): number {
    return message.upvote.length - message.downvote.length;
  }


  userUpvoted(commentary: Msg): boolean {
    if (this.user) {
      return commentary.upvote.includes(this.user.id!);
    }
    return false;
  }


  userDownvoted(commentary: Msg): boolean {
    if (this.user) {
      return commentary.downvote.includes(this.user.id!);
    }
    return false;
  }


  //========
  // Comment
  //========
  getAuthor(id: string): Profile | undefined {
    return this.authors.find(e => e.id == id);
  }


  onSubmitComment() {
    let content = this.form.get('editor')?.value;
    this.form.get('editor')?.reset();
    if (this.companyId && this.post && this.user) {
      this.postService.addComment(this.companyId, this.post.id!, this.user.id!, content);
    }
  }


  canRemoveComment(reply: Msg): boolean {
    return (this.user?.id == reply.usrId);
  }


  removeComment(reply: Msg) {
    if (this.companyId && this.post && this.canRemoveComment(reply)) {
      this.postService.removeComment(this.companyId, this.post.id!, reply.id!);
    }
  }


  //========
  // Utils
  //========
  toDate(timestamp: Timestamp | undefined) {
    return timestamp ? timestamp.toDate().toLocaleString('pt-br') : '';
  }

}
