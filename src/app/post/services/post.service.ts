import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/compat/firestore';
import { Post } from 'src/app/shared/models/post.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { increment, arrayUnion, arrayRemove, serverTimestamp, documentId } from '@angular/fire/firestore';
import { Msg } from 'src/app/shared/models/msg.model';
import { observable, Observable } from 'rxjs';
// import { documentId } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    ) { }


  insert(companyId: string, post: Post, content: string){
    let newPostId = this.db.createId();
    let message0: Msg = {usrId: post.usrId, type: 'original', content: content, upvote: [], downvote: []}

    // let postRef = this.db.collection('companies').doc(companyId).collection('posts').doc(newPostId);
    let postRef = this.getPostRef(companyId, newPostId)
    postRef.set({ ...post, id: newPostId, created: serverTimestamp()});
    postRef.collection('msgs').add({...message0, created: serverTimestamp()})
  }

  
  update(companyId: string, postId: string, title: string, tags: string[], origiId: string, content: string){
    let postRef = this.getPostRef(companyId, postId);
    postRef.update({
      title: title,
      tags: tags,
      modified: serverTimestamp()
    });
    postRef.collection('msgs').doc(origiId).update({
      content: content
    });
  }


  fetchTeamPosts(companyId: string, teamId: string): Observable<Post[]> {
    this.uiService.loadingStateChanged.next(true);
    return new Observable((observer) => {
      this.db.collection('companies').doc(companyId)
        .collection('posts', ref => ref.where('teamId', '==', teamId))
        .valueChanges({ idField: 'id' })
        .subscribe({
          next: (posts) => {
            observer.next(<Post[]>posts)
            this.uiService.loadingStateChanged.next(false);
          },
          error: () => {
            this.uiService.loadingStateChanged.next(false);
          }
        })
    });
  }


  toggleLike(companyId: string, postId: string, userID: string){
    let postDocRef = this.getPostRef(companyId, postId);
    postDocRef.get()
        .subscribe( (postDoc) => {
          if( postDoc.data() ) {
            let post: Post = postDoc.data() as Post;
            post.liked.includes(userID) ? this.removeLike(postDocRef, userID) : this.addLike(postDocRef, userID);
          }
        });
  }


  private addLike(postDocRef: AngularFirestoreDocument, userID: string) {
    postDocRef.update({
      liked: arrayUnion(userID)
    });
  }


  private removeLike(postDocRef: AngularFirestoreDocument, userID: string) {
    postDocRef.update({
      liked: arrayRemove(userID)
    });
  }


  getPostById(postID: string): Observable<{ companyId: string, post: Post, msgs: Msg[] }> {
    return new Observable((observer) => {
      this.db.collectionGroup('posts', ref => ref.where('id', '==', postID)).snapshotChanges()
        .subscribe((docActions) => {
          if (docActions.length > 0) {
            let myPostDoc = docActions[0].payload.doc;
            let postData = myPostDoc.data() as Post;
            let compId = myPostDoc.ref.parent.parent!.id;
            this.db.doc(myPostDoc.ref.path).collection('msgs').valueChanges({ idField: 'id' })
              .subscribe((messages) => {
                // console.log({ companyId: compId, post: postData, msgs: messages as Msg[] });
                observer.next({ companyId: compId, post: postData, msgs: messages as Msg[] });
              })
          }
        })
    })
  }

  
  addComment(companyId: string, postId: string, usrId: string, comment: string){
    let message: Msg = {usrId: usrId, type: 'reply', content: comment, upvote: [], downvote: []}
    this.getPostRef(companyId, postId).collection('msgs')
      .add({...message, created: serverTimestamp()});
  }





  removeComment(companyId: string, postId: string, msgId: string){
    let msgDocRef = this.getMsgRef(companyId, postId, msgId);
    msgDocRef.delete();
  }


  upvoteComment(companyId: string, postId: string, msgId: string, usrId: string) {
    let msgDocRef = this.getMsgRef(companyId, postId, msgId);

    msgDocRef.get()
      .subscribe((msgDocSnap) => {
        if (msgDocSnap.data()) {
          let message = msgDocSnap.data() as Msg;
          if (message.upvote.includes(usrId)) {
            //toggle: remove upvote
            this.removeUpvote(msgDocRef, usrId);
            return;
          }
          if (message.downvote.includes(usrId)) {
            //remove downvote and add upvote
            this.removeDownvote(msgDocRef, usrId);
          }
          //add upvote
          this.addUpvote(msgDocRef, usrId);
        }
      })
  }


  private getPostRef(companyId: string, postId: string) {
    return this.db.collection('companies').doc(companyId).collection('posts').doc(postId);
  }


  private getMsgRef(companyId: string, postId: string, msgId: string) {
    return this.db.collection('companies').doc(companyId)
      .collection('posts').doc(postId).collection('msgs').doc(msgId);
  }


  downvoteComment(companyId: string, postId: string, msgId: string, usrId: string) {
    let msgDocRef = this.getMsgRef(companyId, postId, msgId);

    msgDocRef.get()
      .subscribe((msgDocSnap) => {
        if (msgDocSnap.data()) {
          let message = msgDocSnap.data() as Msg;
          if (message.downvote.includes(usrId)) {
            //toggle: remove downvote
            this.removeDownvote(msgDocRef, usrId);
            return;
          }
          if (message.upvote.includes(usrId)) {
            //remove upvote and add downvote
            this.removeUpvote(msgDocRef, usrId);
          }
          //add upvote
          this.addDownvote(msgDocRef, usrId);
        }
      })
  }


  private addUpvote(msgDocRef: AngularFirestoreDocument, usrId: string) {
    msgDocRef.update({
      upvote: arrayUnion(usrId)
    });
  }

  private removeUpvote(msgDocRef: AngularFirestoreDocument, usrId: string) {
    msgDocRef.update({
      upvote: arrayRemove(usrId)
    });
  }

  private addDownvote(msgDocRef: AngularFirestoreDocument, usrId: string) {
    msgDocRef.update({
      downvote: arrayUnion(usrId)
    });
  }

  private removeDownvote(msgDocRef: AngularFirestoreDocument, usrId: string) {
    msgDocRef.update({
      downvote: arrayRemove(usrId)
    });
  }

  addView(companyId: string, postId: string){
    let msgDocRef = this.getPostRef(companyId, postId);
    msgDocRef.update({viewed: increment(1)})
  }


}
