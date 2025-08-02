import { tweetsData as data } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const commentBtn = document.querySelector('.comment');
 const commentBox = document.querySelector('.comment-modal-container')
export function saveToLocalStorage(data) {
    localStorage.setItem('Data', JSON.stringify(data));
}




function getData() {
    const tweetsData = JSON.parse(localStorage.getItem('Data'))
    return tweetsData
}


const tweetsData = getData();

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.delete) {
        handleTweetdeleteIcon(e.target.dataset.delete)
    }
    else if (e.target.dataset.close) {
        handleCloseCommentModal()
    }
    // else if (e.target.dataset.comment) {
    //     handleComments()
    // }
   
})
function handleComments() {
   
}
function handleCloseCommentModal() {
    document.querySelector('.comment-modal-container').classList.remove('display')
    
    
}
function handleTweetdeleteIcon(tweetId) {
    tweetsData.forEach((tweet,index) => {
        if (tweet.uuid === tweetId) {
             tweetsData.splice(index,1)
         }
     })
    saveToLocalStorage(tweetsData)
     render()
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveToLocalStorage(tweetsData)
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
       saveToLocalStorage(tweetsData)
    render() 
}

let replyingToid=''
function handleReplyClick(replyId) {
    replyingToid = replyId;
   
    commentBox.classList.add('display');
  
   
     document.querySelector('.comment-box').value=''
    
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
       
}
 commentBtn.addEventListener('click',() => {
    const userComment = document.querySelector('.comment-box').value
     let replyId=replyingToid
    const replyObj = {
        handle: '@scrimba',
        profilePic: 'images/scrimbalogo.png',
        tweetText: userComment,
        
    }
        let postId=''
        tweetsData.forEach((tweet) => {
            if (tweet.uuid === replyId) {
                postId=tweet 
            }
        })
        if (postId) {
            postId.replies.unshift(replyObj)
        }
        console.log(postId)

        
        saveToLocalStorage(tweetsData)
        render()

          commentBox.classList.remove('display')
       
    })
   

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
            isMine: true
        })
        saveToLocalStorage(tweetsData)
        console.log(tweetsData)
        render()
        tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    const tweetsData = getData()
    
    tweetsData.forEach(function (tweet) {
        let delHtml=''
        if (tweet.isMine) {
        delHtml+=` <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-delete="${tweet.uuid}"
                    ></i>
                    
                </span>`
        }
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                       
                    </div>
                </div>
        </div>
        `
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
               
                ${delHtml}
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render() {
   
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

