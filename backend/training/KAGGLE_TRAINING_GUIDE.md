# RetinaAI: Kaggle training and safe model replacement

## Scope and non-clinical use

RetinaAI is an educational/research prototype. Its committed `dummy_retina_model.keras` is a genuinely loadable but **untrained** Keras network. DEMO grades and scores are simulated, have no medical meaning, and must never be used to make treatment decisions. The 48 optional preloaded SQLite records are explicit synthetic fixtures (`dummy-v1-fixture`), not inference results. A successfully trained model is not automatically a clinically validated medical device. Do not upload real patient data to this shared prototype.

The notebook in this directory contains executable preprocessing, data splitting, transfer learning, fine-tuning, evaluation, export, and artifact checks. Dataset access and permission remain the researcher's responsibility. It has not been run against a licensed dataset as part of this prototype; no evaluation metrics or clinical performance are claimed.

## Step 1 — Dataset preparation and permissions

Investigate these sources and read their **current official terms** before downloading, attaching, training, or publishing weights:

- **APTOS 2019 Blindness Detection:** https://www.kaggle.com/competitions/aptos2019-blindness-detection — competition access may require a Kaggle account and acceptance of rules. Typical files are `train.csv`, `train_images/`, `id_code`, and `diagnosis`. Do not assume a re-upload has the same authorization as the original competition data.
- **EyePACS / Diabetic Retinopathy Detection:** https://www.kaggle.com/competitions/diabetic-retinopathy-detection — review competition rules and any EyePACS licensing, use, redistribution, and commercial restrictions. Left/right eye image names may share a patient identifier; preserve that grouping across splits.
- **Messidor-2:** https://www.adcis.net/en/third-party/messidor2/ — obtain authorized access from the official provider. ADCIS describes research/educational access with restrictions on redistribution and unauthorized commercial use. Review required acknowledgments and the terms for both images and any separately sourced reference labels. Do not infer that image access includes labels or unrestricted commercial rights.

For each dataset, record its provenance, version, license, access date, permitted purposes, acknowledgment requirements, and whether model-weight distribution is allowed. Do not bypass access controls or redistribute datasets in this repository. Check your institutional ethics/IRB requirements and patient privacy obligations. Do not attempt re-identification. Inspect metadata and images for embedded identifiers; remove identifiers before using any approved secure research environment. Kaggle should only receive data that its terms and your approvals permit.

## Step 2 — Organize data and split without leakage

Expected APTOS-style layout:

```text
/kaggle/input/aptos2019-blindness-detection/
  train.csv
  train_images/
    <id_code>.png
```

CSV labels must map exactly to:

| Integer | Label |
| --- | --- |
| 0 | No DR |
| 1 | Mild DR |
| 2 | Moderate DR |
| 3 | Severe DR |
| 4 | Proliferative DR |

Adapt the notebook's configuration (`DATA_ROOT`, `IMAGE_COLUMN`, `LABEL_COLUMN`, extension) for other authorized datasets. Confirm label provenance and grading policy; do not merge incompatible scales without adjudication. Detect duplicate and near-duplicate images across sources before splitting.

The notebook creates approximately 60% training, 20% validation, and 20% held-out test sets. Where `patient_id` is available, it uses stratified grouped folds and asserts disjoint patient groups. Both eyes, repeat visits, and duplicates from a patient must remain in one split. Where patient IDs are not supplied, image-level stratified splitting is explicitly disclosed as a limitation; it cannot guarantee patient independence. Recover grouping only when identifiers can be interpreted reliably from permitted metadata. Never fabricate patient IDs to claim patient-level separation.

Save the split manifest. Check five-class representation in every split and inspect counts. A group-stratified split is approximate; some datasets need a carefully reviewed split rather than repeated attempts until metrics look good. Fit preprocessing/statistics, class weights, augmentation, and model-selection choices using training data only. Keep the test set locked until final evaluation. Also plan external validation across sites, devices, demographics, and imaging protocols.

## Step 3 — Preprocessing, augmentation, and imbalance

The deployed API has a fixed model input contract:

1. Decode an approved JPEG, PNG, or WebP with Pillow; verify extension/content agreement.
2. Correct EXIF orientation and convert to RGB (no grayscale or BGR inputs).
3. Centrally crop to square and resize to **224 × 224** with Pillow `ImageOps.fit(..., LANCZOS)`.
4. Pass `float32` values in **0–255**, batch shape `(N, 224, 224, 3)`.
5. Put normalization **inside the exported model**, not in the frontend.

The supplied EfficientNetB0 architecture includes Keras' built-in rescaling and expects 0–255 inputs. Do **not** divide inputs by 255 a second time. The dummy model similarly includes a `Rescaling` layer. B3 may be trained at 224 to preserve this contract, but it is often evaluated at a larger native resolution. Changing input resolution would require coordinated backend configuration and validation; it must not silently load into the 224 contract.

Retinal cropping: the current shared pipeline performs a centered crop, not a clinically validated retina detector. Inspect whether important peripheral lesions are lost. More advanced black-border/retinal-circle cropping must be implemented identically in both training and backend preprocessing, tested on diverse images, and documented with the exported model. Do not train with one crop strategy and serve another.

Use modest, clinically reviewed augmentation on the **training split only** (e.g., limited rotation, translation/zoom, and brightness variation). The template uses small rotation/zoom; evaluate transformations for anatomical validity. Avoid inappropriate transforms that remove lesions or materially change disease indicators. Validation/test images must be deterministic.

Class imbalance: report grade counts and use training-derived class weights (implemented), balanced sampling, or a justified loss such as focal loss. Compare per-class recall and false-negative patterns; avoid oversampling or augmenting before splitting. Tune methods only on validation data.

## Step 4 — Transfer-learning architecture

The executable notebook uses:

- `tf.keras.applications.EfficientNetB0(include_top=False, weights='imagenet', input_tensor=...)`.
- A raw RGB 224 input and inference-disabled augmentation inside the model.
- Global average pooling, dropout, and a **five-class softmax** output.
- Sparse categorical cross-entropy, which is appropriate for integer labels 0–4; use categorical cross-entropy only with one-hot labels.
- A frozen-backbone warm-up followed by low-learning-rate fine-tuning of later backbone layers. Batch-normalization layers remain frozen during fine-tuning.
- Class weights, early stopping, learning-rate reduction, and best-weight selection on validation loss.

Enable an available Kaggle GPU and an Internet setting permitted by the dataset/notebook to download ImageNet weights. If Internet is disabled, attach an approved pretrained weight artifact and configure it rather than silently using a randomly initialized backbone. Do not report a successful run unless all cells execute against real, permitted data.

EfficientNetB3 can be evaluated as an alternative with appropriate resource budgets and fixed preprocessing compatibility. Consider ordinal losses or other approaches only with a justified, reproducible validation protocol.

## Step 5 — Evaluate beyond accuracy

The notebook evaluates the held-out test set only after model selection and reports:

- Accuracy (not sufficient by itself).
- Macro and weighted precision, recall, and F1-score.
- Per-class precision/recall/F1 and support.
- Confusion matrix.
- Per-class sensitivity: the diagonal divided by the true-class row total.
- **Quadratic Weighted Kappa (QWK)** via `cohen_kappa_score(..., weights='quadratic')`.
- A separately stated research referral threshold (grade ≥ 2), with sensitivity/specificity; this threshold is not a treatment recommendation.

Analyze false negatives for referable and vision-threatening disease, label quality, inter-grader agreement, and ungradable images. Report confidence intervals using **patient-level** resampling when patient identifiers exist. Evaluate calibration, subgroup performance, dataset shift, and out-of-distribution behavior before considering any real-world use. Softmax is not clinical confidence or the probability of disease. Never insert invented metrics into the application. Clinical deployment requires independent validation, risk management, human-factors assessment, governance, and applicable regulatory authorization.

## Step 6 — Export a self-contained model

The notebook saves:

```python
model.save('/kaggle/working/retina_dr_model.keras')
```

It also writes `model_metadata.json`, `split_manifest.csv`, `evaluation.json`, and a confusion matrix. The metadata states class order, input shape/range, RGB channels, exact preprocessing, model type/version, and research-only status. Do not bundle data or identifying filenames in publicly shared artifacts. Use only built-in/safely serializable Keras layers; this API loads with `safe_mode=True` and does not allow custom object execution.

Reload the exported `.keras` file in a clean runtime, run a known permitted test input, verify `(None, 224, 224, 3)` → `(None, 5)`, finite nonnegative outputs summing to one, and matching predictions before/after serialization. The notebook implements this parity check. Preserve TensorFlow/Keras versions and an artifact checksum with your model card.

## Step 7 — Replace the dummy artifact without rewriting React

Place the model at `backend/app/ml/retina_dr_model.keras`. Keep the original dummy artifact for reproducibility. Update `backend/.env`:

```dotenv
MODEL_PATH=app/ml/retina_dr_model.keras
MODEL_TYPE=TRAINED
MODEL_VERSION=research-effnetb0-v1
SEED_DEMO=false
```

The default configuration is:

```dotenv
MODEL_PATH=app/ml/dummy_retina_model.keras
MODEL_TYPE=DEMO
MODEL_VERSION=dummy-v1
```

The loader checks input/output shapes, output validity, and type/identity compatibility. The demo network is named `retinaai_demo_untrained`; it is rejected if configured as TRAINED. A non-demo artifact configured as DEMO is also rejected. Metadata naming is a guardrail, **not proof of training, validity, or regulatory approval**; operators must verify provenance. Use a distinct model version. The research model must not use the `retinaai_demo` name prefix.

The API always returns `record_id`, five-class grade/label, `model_score`, `model_version`, `model_type`, `quality_status`, `timestamp`, and `is_demo`, plus case and quality details. React reads these fields and changes DEMO labeling automatically. Existing fixture records keep their own DEMO labels even after the active model changes. Scores on trained models are described as **uncalibrated model scores**, never automatically as validated confidence. No frontend or endpoint changes are needed for a contract-compatible artifact.

## Step 8 — Integrate, restart, and verify

1. Download the model and its research documentation from your authorized Kaggle output.
2. Verify checksums/provenance and place it in `backend/app/ml/`.
3. Update the three model environment values; disable example seeding for trained research runs.
4. Confirm input dimensions, color order, raw range, embedded normalization, cropping, class mapping, TensorFlow version, and safe deserialization compatibility.
5. Restart the FastAPI process in your hosting environment. React/Vite need not change.
6. Query `GET /api/health`. Require `model_loaded=true`, `model_type=TRAINED`, and the expected version. The API reports degraded status and refuses inference if checks fail.
7. Send a permitted synthetic test image to `POST /api/screening/analyze` with `case_id`, `patient_reference` beginning `SYN-`, `screening_date`, optional age, and eye.
8. Confirm `is_demo=false`, a valid grade 0–4, five softmax scores, correct version/type, and continued research-only safety warnings. Save the draft and verify history and details.
9. Run the regression tests in a separate test database. The supplied suite defaults explicitly to the dummy artifact; do not modify or delete production/research records during testing.

## Explainability: do not invent evidence

The demo correctly displays no heatmap because it has not learned retinal features. The explanation panel distinguishes illustrative context from genuine model explanations. A research model does not automatically have validated Grad-CAM support. An actual Grad-CAM integration requires selecting a compatible convolutional feature layer, computing gradients for the predicted class, normalizing a genuine activation map, and validating its meaning and failure modes. Do not represent random overlays or attention-like graphics as model evidence. Any future overlay must be labeled with the method, model version, limitations, and original/heatmap controls, and protected with the same access control as its source image. The API schema already reserves nullable `explainability` with `method: GRAD_CAM`, `model_version`, `original_image`, and `heatmap_image`; the UI accepts only embedded PNG/JPEG data with a matching result version, never shows it for DEMO records, and includes original/heatmap toggles. The present backend intentionally returns null; authenticated genuine activation generation must be integrated and validated before populating it.

## Deployment and privacy gate

This prototype is deliberately synthetic-only. SQLite and private uploads need a **persistent filesystem**; the TensorFlow process needs a persistent Python/container host, not ephemeral Vercel function storage. Never publish a database file, raw patient images, administrator keys, or dataset credentials to Git. Add real authentication and per-role/per-record authorization, request and abuse limits, encrypted data storage/backups, audited deletion/retention, monitoring, and clinical/regulatory review before any real data or deployment beyond a restricted demo. CORS is not authentication.
