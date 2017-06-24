import {Component, OnInit} from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import 'rxjs/Rx';

import gql from 'graphql-tag';
// http://dev.apollodata.com/angular2/mutations.html
const NewVideoQuery = gql`
  mutation AddVideoQuery($title: String!,$duration: Int!, $watched: Boolean!){
    createVideo(video: { title: $title, duration: $duration, watched: $watched } ){
      id,
      title
    }
  }
`;
const VideoQuery = gql`
    {
        videos {
            id,
            title
        }
    }
`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: ApolloQueryObservable<any>;
  video: any = {};

  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.data = this.apollo.watchQuery({query: VideoQuery, pollInterval: 10000});
  }

  createVideo() {
    this.apollo.mutate({
      mutation: NewVideoQuery,
      variables: {
        'title': this.video.title || 'Some Video' + Math.floor(Math.random() * 10),
        'duration': 123213,
        'watched': true
      }
    }).subscribe((afterMutation) => {
      console.log(afterMutation);
      // Since apollo caches the request the only way I found to refresh the data set is by
      // forcing the fetchPolicy to network-only in this call
      this.apollo.query({query: VideoQuery, fetchPolicy: 'network-only'})
        .subscribe((data) => {
          console.log(data);
        });
    }, (err) => alert(err));
  }
}
