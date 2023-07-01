#[macro_use]
extern crate rocket;

use rocket::{
    form::Form,
    fs::relative,
    fs::FileServer,
    response::stream::{Event, EventStream},
    serde::{Deserialize, Serialize},
    tokio::select,
    tokio::sync::broadcast::{channel, error::RecvError, Sender},
    Shutdown, State,
};

#[post("/message", data = "<form>")]
fn create_message(form: Form<Message>, queue: &State<Sender<Message>>) -> String {
    queue.send(form.into_inner()).is_ok().to_string()
}

#[get("/events")]
async fn events(queue: &State<Sender<Message>>, mut end: Shutdown) -> EventStream![] {
    let mut rx = queue.subscribe();

    EventStream! {
        loop {
            let msg = select! {
                msg = rx.recv() => match msg {
                    Ok(msg) => msg,
                    Err(RecvError::Closed) => break,
                    Err(RecvError::Lagged(_)) => continue,
                },
                _ = &mut end => break
            };

            yield Event::json(&msg);
        }
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .manage(channel::<Message>(1024).0)
        .mount("/", routes![create_message, events])
        .mount("/", FileServer::from(relative!("dist")))
}

#[derive(Debug, Clone, FromForm, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct Message {
    #[field(validate = len(..30))]
    pub room: String,

    #[field(validate = len(..20))]
    pub username: String,

    pub message: String,
}
