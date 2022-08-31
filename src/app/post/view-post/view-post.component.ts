import { Component, OnInit } from '@angular/core';
import { Msg } from 'src/app/shared/models/msg.model';
import { Post } from 'src/app/shared/models/post.model';

const mockPost: Post = {
  id: 'id1', usrId: '44dvYb0VdnfyRXBdXrtED7afFAp1', title: 'Título do post', type: 'teamPost', teamId: 'tiddalskdjlaskd',
  created: '2022-08-08T13:56:01.442Z', liked: [], viewed: []
};

const mockMsgs: Msg[] = [
  {
    id: '0', usrId: "44dvYb0VdnfyRXBdXrtED7afFAp1", type: 'original', created: "2022-08-08T13:56:01.442Z",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    upvote: [], downvote: []
  },
  {
    id: '2', usrId: "44dvYb0VdnfyRXBdXrtED7afFAp1", type: 'reply', created: "2022-08-09T13:56:01.442Z",
    content: "Lorem ipsum",
    upvote: [], downvote: []
  },
  {
    id: '3', usrId: "44dvYb0VdnfyRXBdXrtED7afFAp1", type: 'reply', created: "2022-08-10T13:56:01.442Z",
    content: "dolor sit amet",
    upvote: [], downvote: []
  },
  {
    id: '4', usrId: "44dvYb0VdnfyRXBdXrtED7afFAp1", type: 'reply', created: "2022-08-11T13:56:01.442Z",
    content: "consectetur adipiscing elit",
    upvote: [], downvote: []
  },
];


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  post: Post = mockPost;
  orderMsgBy: 'mostVoted' | 'newest' | 'oldest' = 'mostVoted';

  originalMsg: Msg | undefined = mockMsgs.find(e => e.type == 'original');
  replyMsgs: Msg[] = mockMsgs.filter(e => e.type == 'reply').sort((a, b) => a.created.localeCompare(b.created));


  constructor() { }

  ngOnInit(): void {
  }

  upvote(id: string) {
    let i = this.replyMsgs.findIndex(e => e.id === id);
    if (i > -1) {
      this.replyMsgs[i].upvote.push("1");
    }
  }

  downvote(id: string) {
    let i = this.replyMsgs.findIndex(e => e.id === id);
    if (i > -1) {
      this.replyMsgs[i].downvote.push("1");
    }
  }

  orderMsgs() {
    switch (this.orderMsgBy) {
      case 'mostVoted':
        this.replyMsgs = this.replyMsgs.sort((a, b) => this.saldo(b) - this.saldo(a));
        break;
      case 'newest':
        this.replyMsgs = this.replyMsgs.sort((a, b) => a.created.localeCompare(b.created));
        break;
      case 'oldest':
        this.replyMsgs = this.replyMsgs.sort((a, b) => b.created.localeCompare(a.created));
        break;
    }
  }


  saldo(a: Msg) {
    return a.upvote.length - a.downvote.length;
  }

}
